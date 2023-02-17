require('dotenv').config();

const mongoose = require('mongoose');
const axios = require('axios')
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }
const sanitizeHtml = require('sanitize-html');
const Comic = require('../models/comics');
const comics = require('./comics')
const gayComics = require('./gayComics')
const GayComic = require('../models/gayComics');
const Episode = require('../models/episodes')
const togetherComics = require('./togetherComics')
const TogetherComic = require('../models/togetherComics')


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


const getShows = async () => {
    try {
        const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=1000`
        const res = await axios.get(url, config)
        // console.log(res.data.data)
        return res.data.data;
    } catch (e) {
        console.log(e);
    }
};

// getShows();

const seedDBwithEpisodes = async () => {
    await Episode.deleteMany({})
    const everyEpisode = await getShows();
    for (let i = 0; i < everyEpisode.length; i++) {
        let description = sanitizeHtml(everyEpisode[i].attributes.description, {
            allowedTags: [],
            allowedAttributes: {},
        })

        const episode = new Episode({
            title: `${ everyEpisode[i].attributes.title }`,
            description: `${ description }`,
            summary: `${ everyEpisode[i].attributes.summary }`,
            transistorID: `${ everyEpisode[i].id }`,
            episodeNumber: `${ everyEpisode[i].attributes.number }`,
            image_url: `${ everyEpisode[i].attributes.image_url }`,
            date: `${ everyEpisode[i].attributes.formatted_published_at }`,
            stringNumber: `${ everyEpisode[i].attributes.number.toString() }`,
        })
        await episode.save()
    }
}

seedDBwithEpisodes().then(() => {
    mongoose.connection.close();
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
            author: '622b6e3138fdc4cef6097ca8',
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
            author: '622b6e3138fdc4cef6097ca8',
            ordinality: `${ parseInt(gayComics[i].path.slice(19, 22)) }`
        })
        await gayComic.save();
    }
}

const seedDBwithTogether = async () => {
    await TogetherComic.deleteMany({});
    for (let i = 0; i < togetherComics.length; i++) {
        const togetherComic = new TogetherComic({
            title: `${ togetherComics[i].title }`,
            path: `${ togetherComics[i].path }`,
            series: 2,
            description: `${ togetherComics[i].description }`,
            filename: `${ togetherComics[i].path.slice(24) }`,
            author: '622b6e3138fdc4cef6097ca8',
            ordinality: `${ parseInt(togetherComics[i].path.slice(24, 27)) }`
        })
        await togetherComic.save();
    }
}


// seedDB().then(() => {
//     mongoose.connection.close();
// })


// seedDBwithGay().then(() => {
//     mongoose.connection.close();
// })

// seedDBwithTogether().then(() => {
//     mongoose.connection.close();
// })