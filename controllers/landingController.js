const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');
const User = mongoose.model('User');
const Fitness = mongoose.model('Fitness');

exports.landingPage = async (req, res) => {
    if (req.isAuthenticated()) {
        const profile = await Profile.findOne({ user: req.user._id });
        const fitness = await Fitness.findOne({ user: req.user._id });
        res.render('landing', { title: 'Welcome to GetFit!', profile, fitness });
    } else {
        res.render('landing', { title: 'Welcome to GetFit!'});
    }
};