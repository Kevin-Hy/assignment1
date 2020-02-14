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
        console.log(`A user disconnected...`)
    })

    socket.on("join", name =>{
        console.log(`${name}Room`);
        socket.join(`${name}Room`);
        socket.to(`${name}Room`).emit("Joined", "someone")
    })

    socket.on("Message", data => {
        const res = { by: data.by, msg: data.msg}
        console.log(`${data.by} sent "${data.msg}" to ${data.room}Room`)
        socket.to(`${data.room}Room`).emit("Message", res)
    })
})

server.listen(port, () => console.log(`Socket.io @ port ${port}`))