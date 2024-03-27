const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, enum: ['admin', 'coach', 'player', 'parent'] }],
    // May also include profile info like name, age, etc.
});

const User = mongoose.model('User', userSchema);

module.exports = User;
