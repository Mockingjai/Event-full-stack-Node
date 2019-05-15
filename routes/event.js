const express = require('express');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const router = express.Router();

const _Events = require('../models/Events');
const auth = require('../middleware/auth');

// @    Method GET me/events/all
// @    Show all of the events
// @    Public
router.get('/show/all', auth ,async (req, res, next) => {
    await _Events.find((err, events) => {
        if(err) {
           return next(new Error(err));
        }
        res.json(events);
    })
});

// @    Method GET me/events/show:id
// @    Show event by id
// @    Public
router.get('/show/:id', auth ,async (req, res, next) => {
    const id = req.params.id;
    await _Events.findById(id, (err, events) => {
        if(err) {
            return next(new Error(err));
        }
        res.json(events);
    })
});

// @    Method POST me/events/create
// @    Creating new event
// @    Public
router.post('/create', auth , [
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

// @    Method PUT me/events/edit
// @    Deleting event
// @    Public
router.put('/edit/:id', auth , [
    check('name').not().isEmpty(),
    check('date').not().isEmpty()
] ,async (req, res, next) => {
    const id = req.params.id;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(401).json({errors: errors.array()});
    }
    await _Events.findById(id, async (error, events) => {
        if(error) {
            return next(new Error("'Wasn't found"));
        }
        events.name = req.body.name;
        events.date = req.body.date;
        await events.save(
            function (error, events) {
                if(error)  { res.status(401).send('Unabled'); }
                res.status(200).json(events);
            }
        )
    })
});

// @    Method DELETE me/events/delete/:id
// @    Deleting event
// @    Public
router.delete('/delete/:id', auth ,async (req, res, next) => {
    const id = req.params.id;
    await _Events.findByIdAndDelete(id, function (err, event) {
        if (err) {
            return next(new Error('Todo was not found'));
        }
        res.json('Successfully removed')
    })
});



module.exports = router;