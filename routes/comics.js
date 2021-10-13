express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Comic = require('../models/comics');
const comics = require('../controllers/comics');

router.route('/')
    .get(catchAsync(comics.index));


module.exports = router;
