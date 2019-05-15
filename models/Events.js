const mongoose = require('mongoose');
const Schema = require("mongoose");

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        // required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'owner'
    }
});


module.exports = EventCreate = mongoose.model('events', EventSchema);