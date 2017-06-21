const mongoose = require('mongoose');
const Profile = mongoose.model('Profile');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const cloudinary = require('cloudinary');
const fs = require('fs');

// multer options for image uploads
const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    }
};

// edit or add profile
exports.addEditProfile = async (req, res) => {
    // query database for logged in user profile
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        // render form for adding new profile if no profile exists
        res.render('editProfile', { title: 'Add Profile' });
    } else {
        // confirm this is users profile
        confirmUser(profile, req.user);
        // render edit form for profile editing if profile exists
        res.render('editProfile', { title: `Edit Profile`, profile });
    }
};

// enable photo upload
exports.upload = multer(multerOptions).single('photo');
// work on uploaded image
exports.resize = async (req, res, next) => {
    // if no file
    if (!req.file) {
        next(); // skip
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    // rename uploaded file
    req.body.photo = `${uuid.v4()}.${extension}`;
    // resize photo
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // upload to cloudinary
    await cloudinary.uploader.upload(`./public/uploads/${req.body.photo}`, function(result) { req.body.photo = result.url });
    // continue
    next();
};

// add submitted profile by POST to database
exports.createProfile = async (req, res) => {
    req.body.user = req.user._id;
    req.body.name = req.user.name;
    if (!req.body.photo) { req.body.photo = "http://res.cloudinary.com/daksh/image/upload/v1497535734/GetFit/profile.jpg" }
    const profile = await (new Profile(req.body)).save();
    req.flash('success', `Successfully created the profile of <strong>${profile.name}</strong>!`)
    res.redirect(`/profile/${profile.slug}`);
};

// list all profiles from database
exports.getProfiles = async (req, res) => {
    // query database for all profiles
    const profiles = await Profile.find();
    res.render('profiles', { title: 'Profiles', profiles });
};

// redirect /profile/me to profile page of logged in user
exports.myProfile = async (req, res) => {
    // find profile from user id
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        // add profile if not present
        req.flash('error', `You don't have a profile yet! Add one now.`);
        res.render('editProfile', { title: 'Add Profile' });
    } else {
        // redirect to profile slug if profile present
        res.redirect(`/profile/${profile.slug}`);
    }
};

// check if this is the correct user
const confirmUser = (profile, user) => {
    if (user == undefined || !profile.user.equals(user._id)) {
        throw Error('You can edit only your own profile! Please log in to the correct account.');
    }
};

// update profile in database on receiving POST
exports.updateProfile = async (req, res) => {
    // find and update profile
    const profile = await Profile.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new profile
        runValidators: true
    }).exec();

    req.flash('success', `Successfully updated profile of <strong>${profile.name}</strong>!`);
    res.redirect(`/profile/${profile.slug}`);
};

// individual profile page on GET at /profile/slug-here
exports.getProfileBySlug = async (req, res, next) => {
    const profile = await Profile.findOne({ slug: req.params.slug }).populate('user');
    if (!profile) return next();
    res.render('profile', { profile, title: profile.name });
};

// handle searching profiles
exports.searchProfiles = async (req, res) => {
    const profiles = await Profile
    // find profiles containing query
    .find({ $text: { $search: req.query.q }}, { score: {$meta: 'textScore'}, name: 1, about: 1, slug: 1, _id: 0 })
    // sort by text score
    .sort({
        score: { $meta: 'textScore' }
    });
    res.json(profiles);
};

// handling hearting profiles
exports.heartProfile = async (req, res) => {
    const hearts = req.user.hearts.map(obj => obj.toString());
    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User.findByIdAndUpdate(req.user._id, {[operator]: { hearts: req.params.id }}, { new: true });
    res.json(user);
};

// get list of hearted profiles
exports.getHearts = async (req, res) => {
    const profiles = await Profile.find({
        _id: { $in: req.user.hearts }
    });
    res.render('profiles', { title: 'Hearted Profiles', profiles });
};