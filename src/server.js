'use strict'

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();
const router = express.Router();

const users = require('./routes/api/user.routes');
const feeding = require('./routes/api/feeding.routes');

// env variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/feeding-schedule'

mongoose.Promise = Promise;
mongoose.connect
    (MONGODB_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
     } );

app.use(bodyParser.json(), cors());

// Passport middleware
app.use(passport.initialize());

// Passport config
require('../config/passport')(passport);

// Routes
app.use('/api/users', users);
app.use('/api/feeding', feeding);

const start = () => {
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    })
}

const stop = module.exports = () => {
    app.close(PORT, () => {
        console.log(`Shut down on port: ${PORT}`)
    })
}

module.exports = {
    start,
    stop,
}

