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
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    league: {
        type: String,
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
