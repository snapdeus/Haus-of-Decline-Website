const { comicSchema, commentSchema, gayComicSchema, gayCommentSchema, togetherComicSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Comic = require('./models/comics');
const GayComic = require('./models/gayComics')
const TogetherComic = require('./models/togetherComics')
const TogetherComment = require('./models/togetherComment')
const Comment = require('./models/comment')
const GayComment = require('./models/gayComment')
const request = require('request')


module.exports.captchaMid = (req, res, next) => {
    const captcha = req.body['g-recaptcha-response'];

    if (captcha) {
        var secretKey = process.env.CAPTCHA;
        var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${ secretKey }&response=${ captcha }&remoteip=${ req.connection.remoteAddress }`;
        request.get(verifyURL, (err, response, body) => {
            if (body.success !== undefined && !body.success) {
                req.flash('error', 'Captcha Failed');
                res.redirect('/register');
            } else {
                next();
            }
        })
    } else {
        req.flash('error', 'Please select captcha');
        res.redirect('/register');
    }
};

module.exports.captchaMidLogin = (req, res, next) => {
    const captcha = req.body['g-recaptcha-response'];

    if (captcha) {
        var secretKey = process.env.CAPTCHA;
        var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${ secretKey }&response=${ captcha }&remoteip=${ req.connection.remoteAddress }`;
        request.get(verifyURL, (err, response, body) => {
            if (body.success !== undefined && !body.success) {
                req.flash('error', 'Captcha Failed');
                res.redirect('/login');
            } else {
                next();
            }
        })
    } else {
        req.flash('error', 'Please select captcha');
        res.redirect('/login');
    }
};




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
    // console.log(comic.author)
    // console.log(req.user._id)
    if (!comic.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/comics/directory`)
    }
    next();
}


module.exports.isGayAuthor = async (req, res, next) => {
    const { id } = req.params;
    const gayComic = await GayComic.findById(id);
    // console.log(gayComic.author)
    // console.log(req.user._id)
    if (!gayComic.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/comics/directory`)
    }
    next();
}

module.exports.isTogetherAuthor = async (req, res, next) => {
    const { id } = req.params;
    const togetherComic = await TogetherComic.findById(id);
    // console.log(gayComic.author)
    // console.log(req.user._id)
    if (!togetherComic.author.equals(req.user._id)) {
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

module.exports.validateTogetherComic = (req, res, next) => {

    const { error } = togetherComicSchema.validate(req.body);

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
    // console.log(comment.author)
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

module.exports.isTogetherCommentAuthor = async (req, res, next) => {
    const { id, togetherCommentId } = req.params;
    const togetherComment = await TogetherComment.findById(togetherCommentId);
    if (!togetherComment.author.equals(req.user._id)) {
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

module.exports.validateTogetherComment = (req, res, next) => {
    const { error } = togetherCommentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}


module.exports.isAuthenticated = (req, res, next) => {
    const authUser = req.user.toObject()
    if (!authUser.hasOwnProperty('isAdmin')) {
        req.flash('error', 'You do not have permission.');
        return res.redirect(`/comics/directory`)
    }
    next();
}