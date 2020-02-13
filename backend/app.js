const express = require("express");
const http = require("http");
const socketIO = require("socket.io")
const mongoose = require('mongoose');

const port = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app)

const io = socketIO(server);

let conf = require('./conf/dbconf');

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
        console.log("user")
    })
})

server.listen(port, () => console.log(`Socket.io @ port ${port}`))