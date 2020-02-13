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
    }
})

module.exports = {
    messageModel() {
        return mongoose.model('Message', Message)
    }
}