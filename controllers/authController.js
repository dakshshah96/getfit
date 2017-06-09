const passport = require('passport');

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