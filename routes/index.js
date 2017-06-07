const express = require('express');
const router = express.Router();

const landingController = require('../controllers/landingController');
const profileController = require('../controllers/profileController'); 
const fitnessController = require('../controllers/fitnessController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', landingController.homePage);

router.get('/add-profile', profileController.addProfile);
router.get('/profiles', catchErrors(profileController.getProfiles));
router.post('/add-profile', catchErrors(profileController.createProfile));

router.get('/add-fitness', fitnessController.addFitness);
router.post('/add-fitness', catchErrors(fitnessController.createFitness));

module.exports = router;