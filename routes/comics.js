express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Comic = require('../models/comics');
const comics = require('../controllers/comics');
const { validateComic } = require('../middleware.js');
const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage })


router.route('/')
    .get(catchAsync(comics.index))
    .post(upload.single('image'), validateComic, catchAsync(comics.createComic))

router.get('/new', comics.renderNewForm);

router.route('/:id')
    .get(catchAsync(comics.showComic))
    .put(upload.single('image'), validateComic, catchAsync(comics.updateComic))
    .delete(catchAsync(comics.deleteComic));

router.get('/:id/edit', catchAsync(comics.renderEditForm));


module.exports = router;
