exports.addFitness = (req, res) => {
    res.render('editFitness', { title: 'Add/Edit Fitness Data' });
};

exports.createFitness = (req, res) => {
    res.json(req.body);
};