const mongoose = require('mongoose');
const Fitness = mongoose.model('Fitness');

// render page for adding fitness on receiving GET
exports.addFitness = (req, res) => {
    res.render('editFitness', { title: 'Add Fitness Data' });
};

// add submitted fitness by POST to database
exports.createFitness = async (req, res) => {
    const fitness = await (new Fitness(req.body)).save();
    req.flash('success', `Successfully created new fitness data!`)
    res.redirect('/fitness/add');
};

// render page for editing fitness on receiving GET
exports.editFitness = async (req, res) => {
    // find fitness from given id
    const fitness = await Fitness.findOne({ _id: req.params.id });
    // confirm this is users fitness (TODO: COMING SOON!!)

    // render edit form for fitness editing
    res.render('editFitness', { title: `Edit ${fitness.name}`, fitness })
};

// update fitness data in database on receiving POST
exports.updateFitness = async (req, res) => {
    // find and update fitness
    const fitness = await Fitness.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new fitness
        runValidators: true
    }).exec();

    req.flash('success', `Successfully updated fitness data!`);
    res.redirect(`/fitness/${fitness._id}/edit`);
};