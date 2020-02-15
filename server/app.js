const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')

/*************************
 * 
 * EXPRESS and Socket.io init
 * 
 *************************/

const port = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app)

const io = socketIO(server);

/*************************
 * 
 * necessary file components
 * 
 *************************/

let conf = require('./conf/dbconf');
const expressRouteMap = require('./routes/routemap')
let Model = require('./model/models')

/*************************
 * 
 * MONGODB ORM
 * 
 *************************/

mongoose.connect(conf.cloud, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Successfully connected to cloud db!");
    },  err => {
        console.log("couldn't connect to cloud db: ", err);
        console.log("Connecting to local db...");
        mongoose.connect(conf.local, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
            if(err){ 
                console.log("Fatal: Can't connect to any server...")
                return process.exit(22)
            }
            else console.log("SUCCESS - Connected to local db");
    })
});

/*************************
 * 
 * Socket.io events
 * Goddamn it's actually hard to just wing it lol
 * 
 *************************/

let users = ['System', 'The Admin'];

io.on("connection", socket => {
    console.log(`A new client connected - (id) : ${socket.id}`);

    Model.eventModel().create({
        type: "CONNECTION",
        event: "A client connected",
        user: socket.id
    })

    socket.on("disconnect", ()=>{
        Model.eventModel().create({
            type: "DISCONNECT",
            event: "A client disconnected",
            user: socket.id
        })
        console.log(`A user disconnected...`)
    })

    socket.on("check-usr", (user)=>{
        let found = users.includes(user);
        console.log(`name: "${user}" is ${found ? 'not available': 'available'} `)
        if(!found) {
            socket.emit("check-usr", {found, users})
            users.push(user)
            socket.broadcast.emit("join", user)
            console.log(users)
            Model.eventModel().create({
                type: "JOIN SUCCESS",
                event: `Connected as ${user}`,
                user: socket.id
            })
        }
        else {
            socket.emit("check-usr", {found})
            Model.eventModel().create({
                type: "JOIN REFUSED",
                event: `name: "${user}" is already taken`,
                user: socket.id
            })
        }
    })

    socket.on("listen", ({room, user}) =>{
        console.log(`${user} is listening @${room}Room`);
        socket.join(`${room}Room`);
        socket.to(`${room}Room`).emit("listening", user)
        Model.eventModel().create({
            type: "LISTENING",
            event: `${user} is now listening @${room}Room`,
            user: socket.id
        })
    })

    socket.on("leave", ({user, room})=>{
        console.log(`${user} has left the chat...`)
        socket.leave(`${room}Room`);
        users=users.filter(usr => user !== usr)
        console.log(users)
        socket.broadcast.emit("userLeave", user)
        Model.eventModel().create({
            type: "LEAVE",
            event: `${user} has signed out... Last room: ${room}Room`,
            user: socket.id
        })
    })
    
    socket.on("unlisten", ({user, room}) => {
        console.log(`${user} is not listening @${room}Room`)
        socket.leave(`${room}Room`);
        socket.to(`${room}Room`).emit("userUnlisten", user)
        Model.eventModel().create({
            type: "UNLISTEN",
            event: `${user} is not listening @${room}Room`,
            user: socket.id
        })
    })

    socket.on("Message", data => {
        let res = {by: data.by, msg: data.msg}
        console.log(`${data.by} sent "${data.msg}" to ${data.room}Room`)
        socket.to(`${data.room}Room`).emit("MessageReceive", res)
        Model.messageModel().create({
            msg: data.msg,
            by: data.by,
            room: `${data.room}Room`
        })
    })
});

/*************************
 * 
 * EXPRESS MIDDLEWARES
 * 
 *************************/

var wstream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(cors());
app.use(morgan('common', {stream: wstream}))
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))

/*************************
 * 
 * EXPRESS Routes
 * 
 *************************/

app.use('/api', expressRouteMap);

/*************************
 * 
 * EXPRESS Final Error Middleware
 * 
 *************************/

app.use((req,res)=>{
    const err = new Error(`Not Found - ${req.originalUrl}`);
    Model.eventModel().create({
        type: "REQUEST ERROR",
        event: `${err.message} \n\n ${err.stack}`,
        user: req.ip
    })
    res.status(404);
    res.json({
        message: err.message,
        stack: err.stack
    })
})

server.listen(port, () => console.log(`Socket.io @ port ${port}`))