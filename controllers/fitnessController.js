const mongoose = require('mongoose');
const Fitness = mongoose.model('Fitness');

exports.addFitness = (req, res) => {
    res.render('editFitness', { title: 'Add/Edit Fitness Data' });
};

exports.createFitness = async (req, res) => {
    const fitness = new Fitness(req.body);
    await fitness.save();
    res.redirect('/');
};