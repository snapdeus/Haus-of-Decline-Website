const express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync');
const patreon = require('../controllers/patreon')
const { isLoggedIn, isAuthenticated } = require('../middleware.js');
const multer = require('multer');

const { storage } = require("../cloudinary");

const upload = multer({ storage });

router.route('/')
    .get(isLoggedIn, isAuthenticated, catchAsync(patreon.index))
    .post(isLoggedIn, isAuthenticated, upload.array('images'), catchAsync(patreon.uploadComic))

module.exports = router;
