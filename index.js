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
const helmet = require('helmet')

require('dotenv').config();

const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }

const userRoutes = require('./routes/user');
const comicRoutes = require('./routes/comics')
const commentRoutes = require('./routes/comments')

const episodesRoutes = require('./routes/episodes')

const MongoStore = require('connect-mongo');
const dbUrl = 'mongodb://localhost:27017/haus-db';

mongoose.connect('mongodb://localhost:27017/haus-db', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
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

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com",
    "https://share.transistor.fm",
    "https://assets.transistor.fm",
    "https://use.fontawesome.com"
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
    "https://assets.transistor.fm"
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
                "https://assets.transistor.fm"
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
                "https://i.creativecommons.org"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
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

app.use('/comics', comicRoutes);
app.use('/comics/:id/comments', commentRoutes)
app.use('/episodes', episodesRoutes);
app.use('/', userRoutes);


const getLatestShow = async () => {
    try {
        const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=1`
        const res = await axios.get(url, config)
        return res.data.data;
    } catch (e) {
        console.log(e);
    }

};


app.get('/', async (req, res) => {
    const comics = await Comic.find({}).sort({ "filename": -1 })
    const episode = await getLatestShow();

    res.render('home', { comics, episode })
});

app.get('/about', (req, res) => {
    res.render('about')
});



//EPISODES SECTION


// const getNumOfEps = async () => {
//     try {
//         const res = await axios.get('https://api.transistor.fm/v1/episodes', config)
//         return res.data.data[0].attributes.number;
//     } catch (e) {
//         console.log(e);
//     }
// };

// const getShows = async () => {
//     try {
//         const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=` + `${ await getNumOfEps() }`
//         const res = await axios.get(url, config)
//         console.log(res.data.data)
//         return res.data.data;
//     } catch (e) {
//         console.log(e);
//     }
// };






app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
});