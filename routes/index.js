const express = require('express');
const router = express.Router();

const landingController = require('../controllers/landingController');
const profileController = require('../controllers/profileController'); 
const fitnessController = require('../controllers/fitnessController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', landingController.homePage);

// routers for profile stuff
router.get('/add/profile', profileController.addProfile);
router.get('/profiles', catchErrors(profileController.getProfiles));
router.get('/profiles/:id/edit', catchErrors(profileController.editProfile));
router.post('/add/profile', catchErrors(profileController.createProfile));
router.post('/add/profile/:id', catchErrors(profileController.updateProfile));

// routers for fitness stuff
router.get('/add/fitness', fitnessController.addFitness);
router.get('/fitness/:id/edit', catchErrors(fitnessController.editFitness));
router.post('/add/fitness', catchErrors(fitnessController.createFitness));
router.post('/add/fitness/:id', catchErrors(fitnessController.updateFitness));

module.exports = router;