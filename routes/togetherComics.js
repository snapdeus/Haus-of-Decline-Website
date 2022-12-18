const express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync');
const TogetherComic = require('../models/togetherComics');
const togetherComics = require('../controllers/togetherComics');
const { validateTogetherComic, resizeComic, isLoggedIn, isTogetherAuthor, isAuthenticated } = require('../middleware.js');
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/TogetherComics')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage })


router.route('/')
    .get(catchAsync(togetherComics.index))
// .post(isLoggedIn, upload.single('image'), validateComic, catchAsync(comics.createComic))

//alternate
// .post(upload.single('image'), resizeComic, validateComic, catchAsync(comics.createComic))


router.route('/:page')
    .get(catchAsync(togetherComics.index))
    .post(isLoggedIn, upload.single('image'), validateTogetherComic, catchAsync(togetherComics.createTogetherComic))

router.get('/:page/new', isLoggedIn, isAuthenticated, togetherComics.renderNewForm);

router.route('/:page/:id')
    .get(catchAsync(togetherComics.showTogetherComic))
    .put(isLoggedIn, isTogetherAuthor, upload.single('image'), validateTogetherComic, catchAsync(togetherComics.updateTogetherComic))
    .delete(isLoggedIn, isTogetherAuthor, togetherComics.deleteTogetherComic);

router.get('/:page/:id/edit', isLoggedIn, isTogetherAuthor, catchAsync(togetherComics.renderTogetherEditForm));


module.exports = router;
