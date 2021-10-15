express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Comic = require('../models/comics');
const comics = require('../controllers/comics');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route('/')
    .get(catchAsync(comics.index))
    .post(catchAsync(comics.createComic))

router.get('/new', comics.renderNewForm);

router.route('/:id')
    .get(catchAsync(comics.showComic))
    .put(catchAsync(comics.updateComic))
    .delete(catchAsync(comics.deleteComic));

router.get('/:id/edit', catchAsync(comics.renderEditForm));


module.exports = router;
