"use strict";

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const morgan = require("morgan");

const app = express();
const router = express.Router();

const users = require("./routes/api/user.routes");
const feeding = require("./routes/api/feeding.routes");
const {
  LaunchRequestHandler,
  LogFeedingEventRequestHandler,
  GetLastFeedingEventRequestHandler,
} = require("./routes/api/alexa.routes");

const Alexa = require("ask-sdk-core");
const { ExpressAdapter } = require("ask-sdk-express-adapter");

const skillBuilder = Alexa.SkillBuilders.custom().withApiClient(
  new Alexa.DefaultApiClient()
);
skillBuilder.addRequestHandlers(
  LaunchRequestHandler,
  LogFeedingEventRequestHandler,
  GetLastFeedingEventRequestHandler
);

const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, true, true);

app.post("/", adapter.getRequestHandlers());

// env variables
const MONGODB_URI =
  process.env.MONGO_URL || "mongodb://localhost/feeding-schedule";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json(), cors());

// Passport middleware
app.use(passport.initialize());

// Passport config
require("../config/passport")(passport);

// Configure logging
morgan.token("user", function (req, res) {
  return req.user ? req.user.email : "NO_USER";
});
app.use(
  morgan(":method :url :status :res[content-length] :user - :response-time ms")
);

// Routes
app.use("/api/users", users);
app.use("/api/feeding", feeding);

module.exports = app;
