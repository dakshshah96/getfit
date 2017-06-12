const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

// schema for user accounts
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address!'],
        required: 'Please supply an email address' 
    },
    name: { type: String, required: 'Please supply a name', trim: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hearts: [
        { type: mongoose.Schema.ObjectId, ref: 'Profile' }
    ]
});

// virtual gravatar key for account image
userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
});

// use email as username for accounts
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);