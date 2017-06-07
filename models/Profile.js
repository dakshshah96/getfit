const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

// schema for user profile
const profileSchema = new mongoose.Schema({
    name: { type: String, required: 'Please enter your name!' },
    slug: String,
    gender: { type: String, required: 'Please select your gender!' },
    age: { type: Number, required: 'Please enter your age!' },
    about: { type: String, required: 'Please write something about you!' },
    weight: { type: Number, required: 'Please enter your weight!', default: 0 },
    height: { type: Number, required: 'Please enter your height!', default: 0 },
    waist: { type: Number, required: 'Please enter your waist size!', default: 0 },
    fat_percent: { type: Number, required: 'Please enter your body fat percentage!', default: 0 },
    created: { type: Date, default: Date.now }
});

// pre-save slug
profileSchema.pre('save', function(next) {
    if(!this.isModified('name')) {
        return next();
    }
    this.slug = slug(this.name);
    next();
    // TODO make more resilient for unique slugs 
});

module.exports = mongoose.model('Profile', profileSchema);