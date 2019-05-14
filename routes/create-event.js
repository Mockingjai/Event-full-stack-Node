const express = require('express');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const router = express.Router();

const Data = require('../models/Data');
const _Events = require('../models/Events');

// @    Method GET /events/all
// @    Show all of the events
// @    Public
router.get('/all', (req, res) => {
    _Events.find((err, events) => {
        if(err) {
           return next(new Error(err));
        }
        res.json(events);
    })
});

// @    Method GET /events/show:id
// @    Show event by id
// @    Public
router.get('/show/:id', (req, res, next) => {
    const id = req.params.id;
    _Events.findById(id, (err, events) => {
        if(err) {
            return next(new Error(err));
        }
        res.json(events);
    })
});

// @    Method POST /events/create
// @    Creating new event
// @    Public
router.post('/create', [
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
// @    Method DELETE /events/delete
// @    Deleting event
// @    Public
router.delete('/delete', (req, res) => {

});
module.exports = router;