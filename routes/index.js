const express = require('express');
const router = express.Router();

// require all our controllers to send routes
const landingController = require('../controllers/landingController');
const profileController = require('../controllers/profileController'); 
const fitnessController = require('../controllers/fitnessController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
// require catchErrors to catch async/await errors
const { catchErrors } = require('../handlers/errorHandlers');

// landing page
router.get('/', landingController.landingPage);


// add/edit a profile if user is logged in
router.get('/profile/add', authController.isLoggedIn, catchErrors(profileController.addEditProfile));
router.get('/profile/edit', authController.isLoggedIn, catchErrors(profileController.addEditProfile));
// get all profils always
router.get('/profiles', catchErrors(profileController.getProfiles));
// redirect to logged in profile page
router.get('/profile/me', authController.isLoggedIn, catchErrors(profileController.myProfile));

// add new profile by POST from profile form
router.post('/profile/add',
    profileController.upload,
    catchErrors(profileController.resize),
    catchErrors(profileController.createProfile)
);
// update already existing profile by POST from profile form
router.post('/profile/add/:id',
    profileController.upload,
    catchErrors(profileController.resize),
    catchErrors(profileController.updateProfile)
);

// go to profile page based on slug
router.get('/profile/:slug', catchErrors(profileController.getProfileBySlug));


// add/edit fitness data if user is logged in
router.get('/fitness/add', authController.isLoggedIn, catchErrors(fitnessController.addEditFitness));
router.get('/fitness/edit', authController.isLoggedIn, catchErrors(fitnessController.addEditFitness));
// add new fitness data by POST from fitness data form
router.post('/fitness/add', catchErrors(fitnessController.createFitness));
// update fitness data by POST from fitness data form
router.post('/fitness/add/:id', catchErrors(fitnessController.updateFitness));
// show logged in users fitness data at /fitness endpoint
router.get('/fitness', authController.isLoggedIn, catchErrors(fitnessController.showFitness));


// show login page to non-logged in users
router.get('/login', userController.loginForm);
// POST to /login from form to log in
router.post('/login', authController.login);
// show register page to non-logged in users
router.get('/register', userController.registerForm);
// POST to register to create new user account
router.post('/register',
    userController.validateRegister,
    userController.validateEmail,
    userController.register,
    authController.login
);
// log out on visiting /logout endpoint
router.get('/logout', authController.logout);


// show edit account form if user is logged in
router.get('/account', authController.isLoggedIn, userController.account);
// update account details on POST from edit account form
router.post('/account', catchErrors(userController.updateAccount));
// forgot password flow on POST to endpoint
router.post('/account/forgot', catchErrors(authController.forgot));
// show new password form if reset token is valid
router.get('/account/reset/:token', catchErrors(authController.reset));
// change password by POST if reset token is valid
router.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update)
);


// get hearted profiles
router.get('/hearts', authController.isLoggedIn, catchErrors(profileController.getHearts));

/*
    API
*/

// show profiles at /api/search endpoint
router.get('/api/search', catchErrors(profileController.searchProfiles));
// show profiles hearted by user at api endpoint
router.post('/api/profiles/:id/heart', catchErrors(profileController.heartProfile));

module.exports = router;