express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync');
const TogetherComic = require('../models/togetherComics');
const TogetherComment = require('../models/togetherComment')
const togetherComments = require('../controllers/togetherComments');
const { validateTogetherComment, isLoggedIn, isTogetherCommentAuthor } = require('../middleware.js');


router.post('/', isLoggedIn, validateTogetherComment, catchAsync(togetherComments.createTogetherComment));



router.delete('/:togetherCommentId', isLoggedIn, isTogetherCommentAuthor, catchAsync(togetherComments.deleteTogetherComment))


module.exports = router;