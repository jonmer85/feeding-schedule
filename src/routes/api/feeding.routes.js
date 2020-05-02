const express = require('express');
const validateJwt = require('../../middleware/jwt-validator');

const router = express.Router();

router.use(validateJwt);


// Load input validation
const validateFeedingEventInput = require('../../validation/feeding_event')

// Load User model
const FeedingEvent = require('../../models/feeding-event');
const keys = require('../../../config/keys')


// @route POST /api/feeding/feeding_event
// @desc Create a new feeding event
// @access Public
router.post('/feeding_event', (req, res) => {
    // Form validation
    const { errors, isValid } = validateFeedingEventInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    FeedingEvent.findOne({ fedOn: req.body.fedOn, userEmail: req.user.email  })
    .then(event => {
        if (event) {
            return res.status(400).json({ email: 'Event already exists'});
        } else {
            const newFeedingEvent = new FeedingEvent({
                userEmail: req.user.email,
                amount: req.body.amount,
                fedOn: req.body.fedOn
            });

            newFeedingEvent
            .save()
            .then(event => res.json(event))
            .catch(err => console.log(err));
        }
    })
})

// @route GET /api/feeding/feeding_events
// @desc Gets all feeding events for a user
// @access Public
router.get('/feeding_events', (req, res) => {
    FeedingEvent.find({ userEmail: req.user.email  })
    .then(events => {
        return res.json(events);
    })
})

module.exports = router;



