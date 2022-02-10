express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync');
const Comic = require('../models/comics');
const Comment = require('../models/comment')
const comments = require('../controllers/comments');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware.js');


router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment));



router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))


module.exports = router;