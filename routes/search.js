express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync');
const search = require('../controllers/search')


router.get('/', catchAsync(search.doSearch));



module.exports = router;