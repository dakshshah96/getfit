const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');

// create our Express app
const app = express();

// Pug setup
app.set('views', path.join(__dirname, 'views')); // Pug files directory
app.set('view engine', 'pug');

// serve static files located in public directory
app.use(express.static(path.join(__dirname, 'public')));

// use body parser to make raw requests usable
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// methods for validating data
app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Use passport js to handle user authentication
app.use(passport.initialize());
app.use(passport.session());

// pass flash message to next page request
app.use(flash());

// pass local variables to all templates and requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// Handle defined routes
app.use('/', routes);

// Forward 404 to error handler
app.use(errorHandlers.notFound);

// Check if errors are validation errors
app.use(errorHandlers.flashValidationErrors);

// A really bad error
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// export app to start application in start.js
module.exports = app;