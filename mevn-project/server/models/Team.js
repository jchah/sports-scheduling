const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40,
    },
    sport: {
        type: String,
        required: true,
        maxlength: 40,
    },
    players: [
        {
            type: String,
            maxlength: 100,
        },
    ],
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
