const express = require('express');
const mongoosePaginate = require('mongoose-paginate');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const router = express.Router();

const _Events = require('../models/Events');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @    Method GET me/events/all
// @    Show all of the events
// @    Public
router.get('/show/all', auth ,async (req, res, next) => {
    //Adding id of the user to the request to get his/her events
    const owner = req.header('owner');

    /* Pagination for events page
    // const { page, perPage } = req.query;
    // const options = {
    //     page: parseInt(page, 10),
    //     limit: parseInt(perPage, 10)
    // };
    // const events = await _Events.paginate({owner: owner},options);
    */

   //Search for all events of the user and sort them by date
    const events = await _Events.find({owner:owner}).limit(20).skip(1).sort({date: -1});
    res.status(200).json(events);
});

// @    Method GET me/events/show:id
// @    Show event by id
// @    Public
router.get('/show/:id', auth ,async (req, res, next) => {
    //Getting id of event from request
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
    //Validating form
    check('name').not().isEmpty(),
    check('date').not().isEmpty(),
], async (req, res) => {
    const { name, date, owner, email } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(401).json({errors: errors.array()})
    }
    try {
        //Searching user by email to get his/her id
        const find = await User.findOne({ email });
        let event = new _Events({
            name: name,
            date: date,
            owner: owner,
        });
        //Marking events by owner id
        event.owner = find._id;
        //Saving event to db
        await event.save();
        //Sending event id for future manipulating
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
    //Validating form
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
        //Get new data for event to update
        events.name = req.body.name;
        events.date = req.body.date;

        await events.save(( error, events ) => {
                if(error) { res.status(401).send('Event unabled'); }
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