const mongoose = require('mongoose');
const Fitness = mongoose.model('Fitness');

// edit or add fitness
exports.addEditFitness = async (req, res) => {
    // query database for fitness data of user
    const fitness = await Fitness.findOne({ user: req.user._id });
    // if no fitness data exists
    if (!fitness) {
        // form for adding new fitness data
        res.render('editFitness', { title: 'Add Fitness Data' });
    } else {
        // render edit form for fitness data if fitness data exists already
        res.render('editFitness', { title: `Edit Fitness Data`, fitness });
    }
};

// add submitted fitness by POST to database
exports.createFitness = async (req, res) => {
    req.body.user = req.user._id;
    const fitness = await (new Fitness(req.body)).save();
    req.flash('success', `Successfully created new fitness data!`)
    res.redirect('/fitness');
};

// update fitness data in database on receiving POST
exports.updateFitness = async (req, res) => {
    // find and update fitness data
    const fitness = await Fitness.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return new fitness
        runValidators: true
    }).exec();

    req.flash('success', `Successfully updated fitness data!`);
    res.redirect(`/fitness`);
};

// show fitness data of logged in user at /fitness
exports.showFitness = async (req, res) => {
    const fitness = await Fitness.findOne({ user: req.user._id });
    if(!fitness) {
        // render form for adding new fitness data if no data exists
        res.render('editFitness', { title: 'Add Fitness Data' });
    } else {
        // display fitness data if there is stored fitness data
        res.render('fitness', { title: `Fitness Data for ${req.user.name}`, fitness });
    }
};