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

require('dotenv').config();


const userRoutes = require('./routes/user');
const comicRoutes = require('./routes/comics')
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

app.use(mongoSanitize({
    replaceWith: '_'
}))
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'squirrel'
    }
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig = {
    store,
    name: "session",
    secret: 'thisshouldbesecret!',
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
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



//ROUTES
app.use('/comics', comicRoutes);
app.use('/episodes', episodesRoutes);
app.use('/', userRoutes);


app.get('/', (req, res) => {
    res.render('home')
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