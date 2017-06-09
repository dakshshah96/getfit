const express = require('express');
const router = express.Router();

const landingController = require('../controllers/landingController');
const profileController = require('../controllers/profileController'); 
const fitnessController = require('../controllers/fitnessController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', landingController.homePage);

// routers for profile stuff
router.get('/profile/add', authController.isLoggedIn, profileController.addProfile);

router.get('/profiles', catchErrors(profileController.getProfiles));

router.get('/profile/:id/edit', catchErrors(profileController.editProfile));

router.post('/profile/add',
    profileController.upload,
    catchErrors(profileController.resize),
    catchErrors(profileController.createProfile)
);

router.post('/profile/add/:id',
    profileController.upload,
    catchErrors(profileController.resize),
    catchErrors(profileController.updateProfile)
);

router.get('/profile/:slug', catchErrors(profileController.getProfileBySlug));

// routers for fitness stuff
router.get('/fitness/add', authController.isLoggedIn, fitnessController.addFitness);
router.get('/fitness/:id/edit', catchErrors(fitnessController.editFitness));
router.post('/fitness/add', catchErrors(fitnessController.createFitness));
router.post('/fitness/add/:id', catchErrors(fitnessController.updateFitness));

// routes for login and signup
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
router.post('/register',
    userController.validateRegister,
    userController.validateEmail,
    userController.register,
    authController.login
);

// route for logging out
router.get('/logout', authController.logout);

// route for account
router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));

module.exports = router;