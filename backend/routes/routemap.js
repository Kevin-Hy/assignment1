const express = require('express')
const server = express.Router();

//const mongoose = require('mongoose');

let Model = require('../model/models');

/**********************************
 * 
 * History
 * 
 **********************************/

 server.route('/history').get((req,res,next)=>{
     Model.messageModel().find({}, (err,data)=>{
        if(err) next(err);
        res.json(data)
     })
 })

 /**********************************
 * 
 * Room History
 * 
 **********************************/

 server.route('/roomhistory').post((req,res,next)=>{
    Model.messageModel().find({room: req.body.roomname}, (err, data) => {
        if(err) next(err);
        res.json(data)
    })
 })

 /**********************************
 * 
 * Room History
 * 
 **********************************/

 server.route('/eventlog').get((req, res, next)=>{
     Model.eventModel().find({}, (err,data) => {
         if(err) next(err)
         res.json(data)
     })
 })

 module.exports = server;