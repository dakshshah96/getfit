const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

// schema for user profiles
const profileSchema = new mongoose.Schema({
    name: { type: String, required: 'Please enter your name!' },
    slug: String,
    gender: { type: String, required: 'Please select your gender!' },
    age: { type: Number, required: 'Please enter your age!' },
    about: { type: String, required: 'Please write something about you!' },
    created: { type: Date, default: Date.now },
    photo: { type: String },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: 'You must supply a user!'}
});

// define indexes for faster searching
profileSchema.index({
    name: 'text',
    about: 'text'
});

// pre-save slug to prevent duplicates on another profile with same name
profileSchema.pre('save', async function(next) {
    if(!this.isModified('name')) {
        return next();
    }
    this.slug = slug(this.name);
    // check for duplicate slugs
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const profilesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (profilesWithSlug.length) {
        this.slug = `${this.slug}-${profilesWithSlug.length + 1}`;
    }
    next();
});

module.exports = mongoose.model('Profile', profileSchema);