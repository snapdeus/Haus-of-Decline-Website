const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios')
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize')
const User = require('./models/user');
const Comic = require('./models/comics')
const GayComic = require('./models/gayComics')
const Comment = require('./models/comment')
const GayComment = require('./models/gayComment')
const Episode = require('./models/episodes')
const helmet = require('helmet')
const subdomain = require('express-subdomain')
const sanitizeHtml = require('sanitize-html');


require('dotenv').config();

const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }

const submitRoutes = require('./routes/submit');
const userRoutes = require('./routes/user');
const comicRoutes = require('./routes/comics');
const gayComicRoutes = require('./routes/gayComics');
const gayCommentRoutes = require('./routes/gayComments');
const commentRoutes = require('./routes/comments');
const togetherCommentRoutes = require('./routes/togetherComments');
const directoryRoutes = require('./routes/directory');
const episodesRoutes = require('./routes/episodes');
const webhookRoutes = require('./routes/webhooks')
const searchRoutes = require('./routes/search')
const patreonRoutes = require('./routes/patreon')
const storeRoutes = require('./routes/store')
const togetherComicRoutes = require('./routes/togetherComics')

const MongoStore = require('connect-mongo');
const { find } = require('./models/user');
const dbUrl = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PW + '@'
    + 'localhost:27017/' + 'haus-db' + '?authSource=admin'



mongoose.connect('mongodb://localhost:27017/haus-db?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PW,
    autoIndex: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});



const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(helmet());
app.use(express.json())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com",
    "https://share.transistor.fm",
    "https://assets.transistor.fm",
    "https://use.fontawesome.com",
    "https://www.google.com",
    "https://www.gstatic.com",
    "http://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://c6.patreon.com"

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://share.transistor.fm",
    "https://assets.transistor.fm"

];
const connectSrcUrls = [
    "https://api.transistor.fm",
    "https://i.creativecommons.org",
    "https://assets.transistor.fm",
    "https://www.google-analytics.com"
];
const fontSrcUrls = [
    "https://fonts.gstatic.com",
    "https://fonts.googleapis.com"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: [
                "blob:",
                "https://share.transistor.fm",
                "https://www.google.com",
                "https://assets.transistor.fm",
                "https://www.patreon.com"
            ],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://share.transistor.fm",
                "https://images.transistor.fm",
                "https://assets.transistor.fm",
                "https://licensebuttons.net",
                "https://i.creativecommons.org",
                "https://www.google-analytics.com",
                "https://overcast.fm/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// mongo sanitize before defining routes
app.use(mongoSanitize({
    replaceWith: '_'
}))
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: "squirrel"
    }
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})



const sessionConfig = {
    store,
    name: "hausSession",
    secret,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

//MAKE SURE PASSPORT.SESSION IS BELOW SESSION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//LOCALS
app.use((req, res, next) => {
    if (!['/login'].includes(req.originalUrl)) {

        req.session.previousReturnTo = req.session.returnTo; // store the previous url
        req.session.returnTo = req.originalUrl; // assign a new url

    }

    res.locals.currentUser = req.user;

    res.locals.success = req.flash('success');

    res.locals.error = req.flash('error');
    next();
})



//ROUTES




const getLatestShow = async () => {
    try {
        const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=1`
        const res = await axios.get(url, config)
        return res.data.data;
    } catch (e) {
        console.log(e);
    }

};


//FOR WHEN WE MAKE OUR OWN STORE
// app.use(subdomain('store', storeRoutes));


app.get('/', async (req, res) => {
    const gayComics = await GayComic.find({}).sort({ "filename": -1 })

    const episode = await getLatestShow();

    // console.log(episode[0].id)
    const findEpisode = await Episode.findOne({ transistorID: `${ episode[0].id }` })
    if (!findEpisode) {
        let description = sanitizeHtml(episode[0].attributes.description, {
            allowedTags: [],
            allowedAttributes: {},
        })
        let newEpisode = new Episode({
            title: `${ episode[0].attributes.title }`,
            description: `${ description }`,
            summary: `${ episode[0].attributes.summary }`,
            transistorID: `${ episode[0].id }`,
            image_url: `${ episode[0].attributes.image_url }`,
            episodeNumber: `${ episode[0].attributes.number }`
        })
        await newEpisode.save()
    }



    res.render('home', { gayComics, episode })
});

app.get('/about', (req, res) => {
    res.render('about')
});



app.get('/support', (req, res) => {
    res.render('support')
});

app.get('/comics', (req, res) => {
    res.redirect('/comics/directory')
})

app.get('/comix', (req, res) => {
    res.redirect('/comics/directory')
})


app.use('/', userRoutes);
app.use('/comics/cod', comicRoutes);
app.use('/submit', submitRoutes);
app.use('/comics/gay', gayComicRoutes);
app.use('/comics/together', togetherComicRoutes)
app.use('/comics/cod/:id/comments', commentRoutes);
app.use('/comics/gay/:id/gayComments', gayCommentRoutes);
app.use('/comics/together/:id/togetherComments', togetherCommentRoutes);
app.use('/episodes', episodesRoutes);
app.use('/comics/directory', directoryRoutes);
app.use('/search', searchRoutes);
app.use('/patreon', patreonRoutes)
app.use('/webhooks', webhookRoutes);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, '127.0.0.1', () => {
    console.log('Serving on Port 3000')
});