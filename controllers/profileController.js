const mongoose = require('mongoose');
const Profile = mongoose.model('Profile');

// render page for adding profile on receiving GET
exports.addProfile = (req, res) => {
    res.render('editProfile', { title: 'Add Profile' });
};

// add submitted profile by POST to database
exports.createProfile = async (req, res) => {
    const profile = await (new Profile(req.body)).save();
    req.flash('success', `Successfully created the profile of <strong>${profile.name}</strong>!`)
    res.redirect('/profiles');
};

// list all profiles from database
exports.getProfiles = async (req, res) => {
    // query database for all profiles
    const profiles = await Profile.find();
    res.render('profiles', { title: 'Profiles', profiles });
};

// render page for editing profile on receiving GET
exports.editProfile = async (req, res) => {
    // find profile from given id
    const profile = await Profile.findOne({ _id: req.params.id });
    // confirm this is users profile (TODO: COMING SOON!!)

    // render edit form for profile editing
    res.render('editProfile', { title: `Edit ${profile.name}`, profile })
};

// update profile in database on receiving POST
exports.updateProfile = async (req, res) => {
    // find and update profile
    const profile = await Profile.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new profile
        runValidators: true
    }).exec();

    req.flash('success', `Successfully updated profile of <strong>${profile.name}</strong>. <a href="/profiles/${profile.slug}">View Profile →</a>`);
    res.redirect(`/profiles/${profile._id}/edit`);
};