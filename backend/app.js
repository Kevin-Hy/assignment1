const express = require("express");
const http = require("http");
const socketIO = require("socket.io")
const mongoose = require('mongoose');

const port = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app)

const io = socketIO(server);

let conf = require('./conf/dbconf');
let Model = require('./model/models')

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
})

let users = ['System', 'The Admin'];

io.on("connection", socket => {

    console.log(`A new client connected - (id) : ${socket.id}`);
    socket.on("disconnect", ()=>{
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
        }
        else socket.emit("check-usr", {found})
    })
    

    socket.on("listen", ({room, user}) =>{
        console.log(`${user} is listening @${room}Room`);
        socket.join(`${room}Room`);
        socket.to(`${room}Room`).emit("listening", user)
        
    })

    socket.on("leave", ({user, room})=>{
        console.log(`${user} has left the chat...`)
        socket.leave(`${room}Room`);
        users=users.filter(usr => user !== usr)
        console.log(users)
        socket.broadcast.emit("userLeave", user)
    })


    
    socket.on("unlisten", ({user, room}) => {
        console.log(`${user} is not listening @${room}Room`)
        socket.leave(`${room}Room`);
        socket.to(`${room}Room`).emit("userUnlisten", user)
    })

    socket.on("Message", data => {
        let res = {by: data.by, msg: data.msg}
        console.log(`${data.by} sent "${data.msg}" to ${data.room}Room`)
        socket.to(`${data.room}Room`).emit("MessageReceive", res)
    })
})

server.listen(port, () => console.log(`Socket.io @ port ${port}`))