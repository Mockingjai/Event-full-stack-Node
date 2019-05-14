const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   name: {
        type: String,
        required: true,
   },
    date: {
        type: String,
        required: true
    }
});


module.exports = User = mongoose.model('users', UserSchema);