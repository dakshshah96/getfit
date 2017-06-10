const mongoose = require('mongoose');
const Profile = mongoose.model('Profile');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

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

// render page for adding profile on receiving GET
exports.addProfile = (req, res) => {
    res.render('editProfile', { title: 'Add Profile' });
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
    // continue
    next();
}

// add submitted profile by POST to database
exports.createProfile = async (req, res) => {
    req.body.user = req.user._id;
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

// redirect /profile/me to profile page of user
exports.myProfile = async (req, res) => {
    // find profile from user id
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
        // add profile if not present
        res.render('editProfile', { title: 'Add Profile' });
    } else {
        // redirect to profile slug
        res.redirect(`/profile/${profile.slug}`);
    }
};

const confirmUser = (profile, user) => {
    if (user == undefined || !profile.user.equals(user._id)) {
        throw Error('You can edit only your own profile! Please log in to the correct account.');
    }
};

// render page for editing profile on receiving GET
exports.editProfile = async (req, res) => {
    // find profile from given id
    const profile = await Profile.findOne({ _id: req.params.id });
    // confirm this is users profile
    confirmUser(profile, req.user);
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

    req.flash('success', `Successfully updated profile of <strong>${profile.name}</strong>. <a href="/profile/${profile.slug}">View Profile →</a>`);
    res.redirect(`/profile/${profile._id}/edit`);
};

// individual profile page on GET at /profile/slug-here
exports.getProfileBySlug = async (req, res, next) => {
    const profile = await Profile.findOne({ slug: req.params.slug }).populate('user');
    if (!profile) return next();
    res.render('profile', { profile, title: profile.name });
};

exports.searchProfiles = async (req, res) => {
    const profiles = await Profile
    // find stores containing query
    .find({ $text: { $search: req.query.q }}, { score: {$meta: 'textScore'}, name: 1, about: 1, slug: 1, _id: 0 })
    // sort by text score
    .sort({
        score: { $meta: 'textScore' }
    });
    res.json(profiles);
};

exports.heartProfile = async (req, res) => {
    const hearts = req.user.hearts.map(obj => obj.toString());
    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User.findByIdAndUpdate(req.user._id, {[operator]: { hearts: req.params.id }}, { new: true });
    res.json(user);
};

exports.getHearts = async (req, res) => {
    const profiles = await Profile.find({
        _id: { $in: req.user.hearts }
    });
    res.render('profiles', { title: 'Hearted Profiles', profiles });
};













