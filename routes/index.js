const express = require('express');
const router = express.Router();

const landingController = require('../controllers/landingController');
const profileController = require('../controllers/profileController'); 
const fitnessController = require('../controllers/fitnessController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', landingController.landingPage);

// routers for profile stuff
router.get('/profile/add', authController.isLoggedIn, catchErrors(profileController.addEditProfile));
router.get('/profiles', catchErrors(profileController.getProfiles));
// redirect to logged in profile page
router.get('/profile/me', authController.isLoggedIn, catchErrors(profileController.myProfile));
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
router.get('/fitness/add', authController.isLoggedIn, catchErrors(fitnessController.addEditFitness));
router.post('/fitness/add', catchErrors(fitnessController.createFitness));
router.post('/fitness/add/:id', catchErrors(fitnessController.updateFitness));
router.get('/fitness', authController.isLoggedIn, catchErrors(fitnessController.showFitness));

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
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update)
);

// get hearts
router.get('/hearts', authController.isLoggedIn, catchErrors(profileController.getHearts));

/*
    API
*/

router.get('/api/search', catchErrors(profileController.searchProfiles));
router.post('/api/profiles/:id/heart', catchErrors(profileController.heartProfile));

module.exports = router;