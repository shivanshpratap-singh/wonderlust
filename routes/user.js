const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');
const WrapAsync = require('../utils/wrapasync.js');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controller/user.js');

router.get('/signup', userController.renderSignupform);

router.post('/signup', WrapAsync(userController.signup));
router.get('/login', userController.renderLoginform);

router.post("/login", saveRedirectUrl , passport.authenticate("local", { failureFlash: true, failureRedirect: '/login' }), userController.loginform);

router.get("/logout", userController.logoutform);


module.exports = router;