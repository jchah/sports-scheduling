const mongoose = require('mongoose');
const enviro = require('dotenv').config()

const connectionString = `mongodb+srv://jchahin11:${process.env.DB_PASS}@cluster0.leuybfu.mongodb.net/`

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Database connected')).catch((err) => console.log(err));
