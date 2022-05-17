const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const store = require('../controllers/store')

router.get('/', catchAsync(store.index))


module.exports = router;
