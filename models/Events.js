const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        // required: true
    }
});


module.exports = EventCreate = mongoose.model('events', EventSchema);