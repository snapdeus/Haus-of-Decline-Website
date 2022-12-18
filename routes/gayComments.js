const express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync');
const GayComic = require('../models/gayComics');
const GayComment = require('../models/gayComment')
const gayComments = require('../controllers/gayComments');
const { validateGayComment, isLoggedIn, isGayCommentAuthor } = require('../middleware.js');


router.post('/', isLoggedIn, validateGayComment, catchAsync(gayComments.createGayComment));



router.delete('/:gayCommentId', isLoggedIn, isGayCommentAuthor, catchAsync(gayComments.deleteGayComment))


module.exports = router;