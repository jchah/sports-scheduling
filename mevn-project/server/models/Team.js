const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{
        type: String,
        ref: 'User'
    }]
    // Additional fields like coach, category, etc. can be added here
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
