const express = require('express');

const app = express();

// include routers
const landingRouter = require('./controllers/landingRouter');
const dashboardRouter = require('./controllers/dashboardRouter');
const profileRouter = require('./controllers/profileRouter');

// static assets
app.use(express.static('public'));

// routers for various screens
app.use('/', landingRouter);
app.use('/dashboard', dashboardRouter);
app.use('/profile', profileRouter);

// listen on port 8080 by default
app.listen(process.env.PORT || 8080);

module.exports = app;