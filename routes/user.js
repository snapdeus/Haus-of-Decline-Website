const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const user = require('../controllers/user')
const { captchaMid } = require('../middleware.js');


router.route('/register')
    .get(user.renderRegister)
    .post(captchaMid, catchAsync(user.registerUser))


//testing without captcha
// router.route('/register')
//     .get(user.renderRegister)
//     .post(catchAsync(user.registerUser))



router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)


router.get('/logout', user.logout)

module.exports = router;