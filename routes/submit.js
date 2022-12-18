const express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync');
const TogetherComic = require('../models/togetherComics');
const submit = require('../controllers/submit');
const { validateTogetherComic, resizeComic, isLoggedIn, isTogetherAuthor, isAuthenticated } = require('../middleware.js');
const multer = require('multer');


router.get('/', isLoggedIn, isAuthenticated, submit.index);

module.exports = router;