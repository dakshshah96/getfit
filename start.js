const mongoose = require('mongoose');

// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log('Dang! You\'re running an old version of Node.js. Please install Node.js 7.6+ and be back here.');
  process.exit();
}

// import environmental variables from variables.env
require('dotenv').config({ path: 'variables.env' });

// Connect to database and handle bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🚫🚫🚫🚫 ERROR → ${err.message}`);
});

// import all models
require('./models/Profile');
require('./models/Fitness');
require('./models/User');

// Start app!
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});