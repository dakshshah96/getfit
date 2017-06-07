exports.addProfile = (req, res) => {
    res.render('editProfile', { title: 'Add/Edit Profile' });
};

exports.createProfile = (req, res) => {
    res.json(req.body);
};