const mongoose = require('mongoose');
const Fitness = mongoose.model('Fitness');

exports.addFitness = (req, res) => {
    res.render('editFitness', { title: 'Add/Edit Fitness Data' });
};

exports.createFitness = async (req, res) => {
    const fitness = await (new Fitness(req.body)).save();
    req.flash('success', `Successfully updated fitness data!`)
    res.redirect('/');
};