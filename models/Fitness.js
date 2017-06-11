const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// schema for user profile
const fitnessSchema = new mongoose.Schema({
    walk: { type: Number, default: 0 },
    run: { type: Number, default: 0 },
    swim: { type: Number, default: 0 },
    basketball: { type: Number, default: 0 },
    football: { type: Number, default: 0 },
    tennis: { type: Number, default: 0 },
    water_drank: { type: Number, default: 0 },
    calories_to_burn: { type: Number, default: 0, required: true },
    water_to_drink: { type: Number, default: 0 },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: 'You must supply a user!' }
});

module.exports = mongoose.model('Fitness', fitnessSchema);