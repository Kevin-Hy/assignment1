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


io.on("connection", socket => {
    console.log(`A new client connected - (id) : ${socket.id}`);
    socket.on("disconnect", ()=>{
        console.log(`A user left the chatroom...`)
    })

    socket.on("Message", data => {
        console.log(`${data.by} sent "${data.msg}"`)
        socket.broadcast.emit("Message", data)
    })

    socket.on("Joined", data=>{
        console.log(`${data} has joined the room`)
        socket.broadcast.emit("Joined", data)
    })

    socket.on("Leave", data=>{
        console.log(`${data} left the room`)
        socket.broadcast.emit("Leave", data)
    })
})

server.listen(port, () => console.log(`Socket.io @ port ${port}`))