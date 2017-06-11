const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');
const User = mongoose.model('User');
const Fitness = mongoose.model('Fitness');

exports.landingPage = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('landing', { title: 'Welcome to GetFit!' });
    } else {
        res.render('landing', { title: 'Welcome to GetFit!' });
    }
};