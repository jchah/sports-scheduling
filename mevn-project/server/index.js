const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./db')
const Event = require('./models/Event')
const League = require('./models/League')
const User = require('./models/User')
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Create a new event
app.post('/events', (req, res) => {
    // Create new event
    const newEvent = new Event(req.body);
    newEvent.save()
        .then(event => res.status(201).json(event))
        .catch(err => res.status(400).json({ message: "Error creating event", error: err }));
});

// Retrieve all events
app.get('/events', (req, res) => {
    Event.find()
        .then(events => res.json(events))
        .catch(err => res.status(400).json({ message: "Error fetching events", error: err }));
});

// Get a single event by ID
app.get('/events/:id', (req, res) => {
    Event.findById(req.params.id)
        .then(event => {
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.json(event);
        })
        .catch(err => res.status(500).json({ message: "Error fetching event", error: err }));
});

// Update a single event by ID
app.put('/events/:id', (req, res) => {
    Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then(event => {
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.json(event);
        })
        .catch(err => res.status(400).json({ message: "Error updating event", error: err }));
});

// Delete a single event by ID
app.delete('/events/:id', (req, res) => {
    Event.findByIdAndDelete(req.params.id)
        .then(event => {
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.status(200).json({ message: "Event deleted successfully" });
        })
        .catch(err => res.status(500).json({ message: "Error deleting event", error: err }));
});

// Create a new league
app.post('/leagues', (req, res) => {
    const newLeague = new League(req.body);
    newLeague.save()
        .then(league => res.status(201).json(league))
        .catch(err => res.status(400).json({ message: "Error creating league", error: err }));
});

// Retrieve all leagues
app.get('/leagues', (req, res) => {
    League.find()
        .then(leagues => res.json(leagues))
        .catch(err => res.status(400).json({ message: "Error fetching leagues", error: err }));
});

// Retrieve a single league by ID
app.get('/leagues/:id', (req, res) => {
    League.findById(req.params.id)
        .then(league => {
            if (!league) return res.status(404).json({ message: "League not found" });
            res.json(league);
        })
        .catch(err => res.status(400).json({ message: "Error fetching league", error: err }));
});

// Update an existing league by ID
app.put('/leagues/:id', (req, res) => {
    League.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(league => {
            if (!league) return res.status(404).json({ message: "League not found" });
            res.json(league);
        })
        .catch(err => res.status(400).json({ message: "Error updating league", error: err }));
});

// Delete a league by ID
app.delete('/leagues/:id', (req, res) => {
    League.findByIdAndDelete(req.params.id)
        .then(league => {
            if (!league) return res.status(404).json({ message: "League not found" });
            res.json({ message: "League deleted successfully" });
        })
        .catch(err => res.status(400).json({ message: "Error deleting league", error: err }));
});

// Create a new user
app.post('/users', (req, res) => {
    const newUser = new User(req.body);
    newUser.save()
        .then(user => res.status(201).json(user))
        .catch(err => res.status(400).json({ message: "Error creating user", error: err }));
});

// Retrieve all users
app.get('/users', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ message: "Error fetching users", error: err }));
});

// Retrieve a single user by ID
app.get('/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        })
        .catch(err => res.status(400).json({ message: "Error fetching user", error: err }));
});

// Update an existing user by ID
app.put('/users/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        })
        .catch(err => res.status(400).json({ message: "Error updating user", error: err }));
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json({ message: "User deleted successfully" });
        })
        .catch(err => res.status(400).json({ message: "Error deleting user", error: err }));
});

const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const Team = require("./models/Team");

const userEmail = process.env.FROM_EMAIL;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: userEmail,
        pass: process.env.EMAIL_PASS,
    }
});

app.post('/schedule-email', async (req, res) => {
    const { to, subject, body, sendAt } = req.body;

    try {
        schedule.scheduleJob(new Date(sendAt), async function() {
            const info = await transporter.sendMail({
                from: `"Friendly Reminder" <${userEmail}>`,
                to,
                subject,
                text: body
            });

            console.log('Scheduled Message sent: %s', info.messageId);
        });

        res.send({ message: 'Email scheduled successfully' });
    } catch (error) {
        console.error('Failed to schedule email:', error);
        res.status(500).send({ error: 'Failed to schedule email', details: error });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password, } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            data: {
                user: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }
});

// Create a new account
app.post('/create-account', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            role
        });

        await newUser.save();  // Save the new user to the database

        res.status(201).json({ message: "Account created successfully", user: { username, role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create account", error: err });
    }
});

app.post('/teams', (req, res) => {
    const newTeam = new Team(req.body);
    newTeam.save()
        .then(team => res.status(201).json(team))
        .catch(err => res.status(400).json({ message: "Error creating team", error: err }));
});

app.get('/teams', (req, res) => {
    Team.find()
        .then(teams => res.json(teams))
        .catch(err => res.status(400).json({ message: "Error fetching teams", error: err }));
});

app.get('/teams/:id', (req, res) => {
    Team.findById(req.params.id)
        .then(team => {
            if (!team) return res.status(404).json({ message: "Team not found" });
            res.json(team);
        })
        .catch(err => res.status(400).json({ message: "Error fetching team", error: err }));
});

app.put('/teams/:id', (req, res) => {
    Team.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(team => {
            if (!team) return res.status(404).json({ message: "Team not found" });
            res.json(team);
        })
        .catch(err => res.status(400).json({ message: "Error updating team", error: err }));
});

app.delete('/teams/:id', (req, res) => {
    Team.findByIdAndDelete(req.params.id)
        .then(team => {
            if (!team) return res.status(404).json({ message: "Team not found" });
            res.json({ message: "Team deleted successfully" });
        })
        .catch(err => res.status(400).json({ message: "Error deleting team", error: err }));
});

