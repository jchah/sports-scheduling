const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sport: { type: String, required: true },
    teams: [{
        type: String,
        ref: 'Team'
    }]
    // Additional fields like season, rules, etc. can be added here
});

const League = mongoose.model('League', leagueSchema);

module.exports = League;
