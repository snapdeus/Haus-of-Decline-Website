const { comicSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Comic = require('./models/comics');
const im = require('imagemagick');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateComic = (req, res, next) => {

    const { error } = comicSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.resizeComic = (req, res, next) => {
    const image = im.resize({
        srcPath: "uploads/" + req.file.filename,
        dstPath: `uploads/${ req.file.filename }`,
        width: 100,
        height: 100,
    }, function (err, stdout, stderr) {
        if (err) throw err;
        console.log('resized comic');

    })
    next()
}


