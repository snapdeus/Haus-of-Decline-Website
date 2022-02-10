express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Comic = require('../models/comics');
const comics = require('../controllers/comics');
const { validateComic, resizeComic, isLoggedIn, isAuthor } = require('../middleware.js');
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
// .post(isLoggedIn, upload.single('image'), validateComic, catchAsync(comics.createComic))

//alternate
// .post(upload.single('image'), resizeComic, validateComic, catchAsync(comics.createComic))


router.route('/:page')
    .get(catchAsync(comics.index))
    .post(isLoggedIn, upload.single('image'), validateComic, catchAsync(comics.createComic))

router.get('/:page/new', isLoggedIn, comics.renderNewForm);

router.route('/:page/:id')
    .get(catchAsync(comics.showComic))
    .put(isLoggedIn, isAuthor, upload.single('image'), validateComic, catchAsync(comics.updateComic))
    .delete(isLoggedIn, isAuthor, comics.deleteComic);

router.get('/:page/:id/edit', isLoggedIn, isAuthor, catchAsync(comics.renderEditForm));


module.exports = router;
