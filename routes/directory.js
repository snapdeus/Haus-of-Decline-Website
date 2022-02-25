express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const directory = require('../controllers/directory');



router.route('/')
    .get(catchAsync(directory.showDirectory))


module.exports = router;