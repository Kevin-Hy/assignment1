const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Message = new Schema({
    msg: {
        type: String,
        required: true
    },
    by: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    room: {
        type: String,
        required: true
    }
})

let Events = new Schema({
    type: {
        type:String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    event: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
})

module.exports = {
    messageModel() {
        return mongoose.model('Message', Message)
    },
    eventModel() {
        return mongoose.model('Events', Events)
    }
}