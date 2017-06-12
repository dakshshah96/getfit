const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

// log in user
exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    successRedirect: '/',
    successFlash: 'You\'re now logged in!'
});

// log out user
exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You\'ve logged out successfully! 👋');
    res.redirect('/');
};

// check if user is logged in
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); // logged in
        return;
    }
    req.flash('error', 'You must be logged in to do that!');
    res.redirect('/login');
};

// forgot password flow
exports.forgot = async (req, res) => {
    // check user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'No account exists with that email address!');
        return res.redirect('/login');
    }

    // set reset tokens and expires on account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // send email with token
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user,
        subject: 'Reset Your GetFit Password',
        resetURL
    });
    req.flash('success', `Password reset link has been sent!`);

    // redirect to login page
    res.redirect('/login');
};

// reset password flow
exports.reset = async (req, res) => {
    // match URL params to database entry
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    // invalid reset link
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired!');
        return res.redirect('/login');
    }

    // show reset password form if token is valid
    res.render('reset', { title: 'Reset Password' });
};

// check password and confirm password match
exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        next(); // continue
        return;
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
};

// password update flow
exports.update = async (req, res) => {
    // match url params to database entry
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    // invalid reset link
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired!');
        return res.redirect('/login');
    }

    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    // remove token and expires database
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // save to database
    const updatedUser = await user.save();
    // log in user automatically
    await req.login(updatedUser);
    req.flash('success', 'Your password has been reset and you\'re now logged in! 💃');
    res.redirect('/');
};