const { comicSchema, commentSchema, gayComicSchema, gayCommentSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Comic = require('./models/comics');
const GayComic = require('./models/gayComics')
const Comment = require('./models/comment')
const GayComment = require('./models/gayComment')
const im = require('imagemagick');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const comic = await Comic.findById(id);
    console.log(comic.author)
    console.log(req.user._id)
    if (!comic.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/comics/directory`)
    }
    next();
}


module.exports.isGayAuthor = async (req, res, next) => {
    const { id } = req.params;
    const gayComic = await GayComic.findById(id);
    console.log(gayComic.author)
    console.log(req.user._id)
    if (!gayComic.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/comics/directory`)
    }
    next();
}

module.exports.validateComic = (req, res, next) => {

    const { error } = comicSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateGayComic = (req, res, next) => {

    const { error } = gayComicSchema.validate(req.body);

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
};

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/comics/directory`)
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isGayCommentAuthor = async (req, res, next) => {
    const { id, gayCommentId } = req.params;
    const gayComment = await GayComment.findById(gayCommentId);
    if (!gayComment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/comics/directory`)
    }
    next();
}

module.exports.validateGayComment = (req, res, next) => {
    const { error } = gayCommentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


