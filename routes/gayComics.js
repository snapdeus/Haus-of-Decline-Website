express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync');
const GayComic = require('../models/gayComics');
const gayComics = require('../controllers/gayComics');
const { validateGayComic, resizeComic, isLoggedIn, isGayAuthor, isAuthenticated } = require('../middleware.js');
const multer = require('multer');



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
    .get(catchAsync(gayComics.index))
// .post(isLoggedIn, upload.single('image'), validateComic, catchAsync(comics.createComic))

//alternate
// .post(upload.single('image'), resizeComic, validateComic, catchAsync(comics.createComic))


router.route('/:page')
    .get(catchAsync(gayComics.index))
    .post(isLoggedIn, upload.single('image'), validateGayComic, catchAsync(gayComics.createGayComic))

router.get('/:page/new', isLoggedIn, isAuthenticated, gayComics.renderNewForm);

router.route('/:page/:id')
    .get(catchAsync(gayComics.showGayComic))
    .put(isLoggedIn, isGayAuthor, upload.single('image'), validateGayComic, catchAsync(gayComics.updateGayComic))
    .delete(isLoggedIn, isGayAuthor, gayComics.deleteGayComic);

router.get('/:page/:id/edit', isLoggedIn, isGayAuthor, catchAsync(gayComics.renderGayEditForm));


module.exports = router;
