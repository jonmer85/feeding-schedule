const mongoose = require('mongoose');

const feedingEventSchema = mongoose.Schema({
    userEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    fedOn: { type: Date, default: () => new Date() },
});

const FeedingEvent = module.exports = mongoose.model('feeding_event', feedingEventSchema)