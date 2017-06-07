const mongoose = require('mongoose');
const Profile = mongoose.model('Profile');

exports.addProfile = (req, res) => {
    res.render('editProfile', { title: 'Add/Edit Profile' });
};

exports.createProfile = async (req, res) => {
    const profile = await (new Profile(req.body)).save();
    req.flash('success', `Successfully updated the profile of <strong>${profile.name}</strong>!`)
    res.redirect('/');
};

exports.getProfiles = async (req, res) => {
    // query database for all profiles
    const profiles = await Profile.find();
    res.render('profiles', { title: 'Profiles', profiles });
};