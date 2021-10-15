const { comicSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Comic = require('./models/comics');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
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