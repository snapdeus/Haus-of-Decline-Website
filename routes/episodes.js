const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const episodes = require('../controllers/episodes');


router.route('/')
    .get(catchAsync(episodes.index))

router.route('/:page')
    .get(catchAsync(episodes.index))

//added in page here
router.route('/:page/:id')
    .get(catchAsync(episodes.showEpisode))

module.exports = router;
