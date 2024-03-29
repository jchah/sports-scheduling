const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: {
        type: String,
        required: true
    },
    description: String,
    startTime: {
        type: Date,
        required: true
    },
    endTime: Date,
    teams: [{
        type: String,
    }],
    league: {
        type: String,
    }
    // Additional fields like status, scores, etc. can be added here
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
