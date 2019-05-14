const express = require('express');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const router = express.Router();

const _Events = require('../models/Events');

// @    Method GET /events
// @    Show that we have access to create-event
// @    Public
router.get('/', (req, res) => {
    res.status(200).send('Hi from events');
});

// @    Method POST /events
// @    Creating new event
// @    Public
router.post('/', [
    check('name').not().isEmpty(),
    check('date').not().isEmpty(),
], async (req, res) => {
    const { name, date } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(401).json({errors: errors.array()})
    }
    try {
        // let event = await _Events.findOne({ name });

        let event = new _Events({
            name: name,
            date: date
        });

        await event.save();
        console.log(event._id);
        res.send(event._id);
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Server error');
    }

});
module.exports = router;