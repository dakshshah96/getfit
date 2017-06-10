const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

// exports.login = (req, res, next) => {
//     passport.authenticate('local', function(err, user, info) {
//     if (err || !user) {
//         req.flash('error', 'Something went wrong. Please check your login details!');
//         res.locals.messages = req.flash();
//         res.redirect('/login');
//     }
//     req.login(user, function(err) {
//         if (err) {
//             req.flash('error', 'Something went wrong. Please check your login details!');
//             res.locals.messages = req.flash();
//             res.redirect('/login');
//         } else {
//             req.flash('success', 'You\'re now logged in!');
//             res.locals.messages = req.flash();
//             res.redirect('/profiles');
//         }
//     })(req, res, next);
//     });
// }

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    successRedirect: '/profiles',
    successFlash: 'You\'re now logged in!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You\'ve logged out successfully! 👋');
    res.redirect('/profiles');
};
 
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); // logged in
        return;
    }
    req.flash('error', 'You must be logged in to do that!');
    res.redirect('/login');
};

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

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired!');
        return res.redirect('/login');
    }

    // show reset password form if token is valid
    res.render('reset', { title: 'Reset Password' });
};

// check that password and confirm password match
exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        next(); // continue
        return;
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
};

exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired!');
        return res.redirect('/login');
    }

    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Your password has been reset and you\'re now logged in! 💃');
    res.redirect('/');
};