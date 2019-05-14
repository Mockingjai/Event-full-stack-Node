const mongoose = require('mongoose');

const EventsData = new mongoose.Schema({
    events: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'events'
    }
});


module.exports = User = mongoose.model('data', EventsData);