const mongoose = require('mongoose');
const Profile = mongoose.model('Profile');

exports.addProfile = (req, res) => {
    res.render('editProfile', { title: 'Add/Edit Profile' });
};

exports.createProfile = async (req, res) => {
    const profile = new Profile(req.body);
    await profile.save();
    res.redirect('/');
};