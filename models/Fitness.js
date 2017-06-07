const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// schema for user profile
const fitnessSchema = new mongoose.Schema({
    activities: [{
        activity: { type: String, required: true },
        calories: { type: Number, default: 0 }
    }],
    calories_burnt: { type: Number, default: 0 },
    water_drank: { type: Number, default: 0 },
    calories_to_burn: { type: Number, default: 0 },
    water_to_drink: { type: Number, default: 0 }
});

module.exports = mongoose.model('Fitness', fitnessSchema);