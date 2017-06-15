const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// schema for fitness data
const fitnessSchema = new mongoose.Schema({
    weight: { type: Number, required: 'Please enter your weight!', default: 0 },
    weight_goal: { type: Number, required: 'Please enter your weight!', default: 0 },
    height: { type: Number, required: 'Please enter your height!', default: 0 },
    waist: { type: Number, required: 'Please enter your waist size!', default: 0 },
    waist_goal: { type: Number, required: 'Please enter your weight!', default: 0 },
    fat_percent: { type: Number, required: 'Please enter your body fat percentage!', default: 0 },
    fat_percent_goal: { type: Number, required: 'Please enter your weight!', default: 0 },
    walk: { type: Number, default: 0 },
    run: { type: Number, default: 0 },
    swim: { type: Number, default: 0 },
    basketball: { type: Number, default: 0 },
    football: { type: Number, default: 0 },
    tennis: { type: Number, default: 0 },
    water_drank: { type: Number, default: 0 },
    calories_to_burn: { type: Number, default: 0, required: 'Please enter your calories goal!' },
    water_to_drink: { type: Number, default: 0 },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: 'You must supply a user!' }
});

module.exports = mongoose.model('Fitness', fitnessSchema);