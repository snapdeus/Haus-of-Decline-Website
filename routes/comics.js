express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Comic = require('../models/comics');
const comics = require('../controllers/comics');
const { validateComic, resizeComic, isLoggedIn } = require('../middleware.js');
const multer = require('multer');
const im = require('imagemagick');


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
    .post(isLoggedIn, upload.single('image'), validateComic, catchAsync(comics.createComic))
// .post(upload.single('image'), resizeComic, validateComic, catchAsync(comics.createComic))


router.get('/new', isLoggedIn, comics.renderNewForm);

router.route('/:id')
    .get(catchAsync(comics.showComic))
    .put(isLoggedIn, upload.single('image'), validateComic, catchAsync(comics.updateComic))
    .delete(catchAsync(isLoggedIn, comics.deleteComic));

router.get('/:id/edit', isLoggedIn, catchAsync(comics.renderEditForm));


module.exports = router;
