const mongoose = require('mongoose');

// render landing page
exports.landingPage = (req, res) => {
    res.render('landing', { title: 'Welcome to GetFit!' });
};