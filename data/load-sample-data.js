require('dotenv').config({ path: __dirname + '/../variables.env' });
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models
const User = require('../models/User');
const Profile = require('../models/Profile');
const Fitness = require('../models/Fitness');

const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'));
const profiles = JSON.parse(fs.readFileSync(__dirname + '/profiles.json', 'utf-8'));
const fitnessData = JSON.parse(fs.readFileSync(__dirname + '/fitnessData.json', 'utf-8'));

async function deleteData() {
  console.log('Goodbye Data! 😢');
  await User.remove();
  await Profile.remove();
  await Fitness.remove();
  console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n');
  process.exit();
}

async function loadData() {
  try {
    await User.insertMany(users);
    await Profile.insertMany(profiles);
    await Fitness.insertMany(fitnessData);
    console.log('Data loaded! 👍');
    process.exit();
  } catch(e) {
    console.log('\nError! 👎 The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n');
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
