const mongoose = require('mongoose');
const Comic = require('../models/comics');
const comics = require('./comics')
const gayComics = require('./gayComics')
const GayComic = require('../models/gayComics');

require('dotenv').config();
const ALEX_ID = process.env.ALEX_ID;


mongoose.connect('mongodb://localhost:27017/haus-db?authSource=admin', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PW,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Comic.deleteMany({});
    for (let i = 0; i < comics.length; i++) {
        const comic = new Comic({
            description: `${ comics[i].description }`,
            title: `${ comics[i].title }`,
            path: `${ comics[i].path }`,
            series: 0,
            filename: `${ comics[i].path.slice(9) }`,
            author: ALEX_ID,
            ordinality: `${ parseInt(comics[i].path.slice(9, 12)) }`
        })
        await comic.save();
    }
}

const seedDBwithGay = async () => {
    await GayComic.deleteMany({});
    for (let i = 0; i < gayComics.length; i++) {
        const gayComic = new GayComic({
            description: `${ gayComics[i].description }`,
            title: `${ gayComics[i].title }`,
            path: `${ gayComics[i].path }`,
            series: 1,
            filename: `${ gayComics[i].path.slice(19) }`,
            author: '616b71a610e1e8eb28069c0c',
            ordinality: `${ parseInt(gayComics[i].path.slice(19, 22)) }`
        })
        await gayComic.save();
    }
}


// seedDB().then(() => {
//     mongoose.connection.close();
// })


seedDBwithGay().then(() => {
    mongoose.connection.close();
})