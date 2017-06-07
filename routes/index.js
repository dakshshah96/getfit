const express = require('express');
const router = express.Router();

const landingController = require('../controllers/landingController');
const profileController = require('../controllers/profileController'); 
const fitnessController = require('../controllers/fitnessController'); 

router.get('/', landingController.homePage);

router.get('/add-profile', profileController.addProfile);
router.post('/add-profile', profileController.createProfile);

router.get('/add-fitness', fitnessController.addFitness);
router.post('/add-fitness', fitnessController.createFitness);

module.exports = router;