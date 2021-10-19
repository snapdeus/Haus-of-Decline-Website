const mongoose = require('mongoose');
const Comic = require('../models/comics');
const comics = require('./comics')

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

const seedDB = async () => {
    await Comic.deleteMany({});
    for (let i = 0; i < comics.length; i++) {
        const comic = new Comic({
            description: `${ comics[i].description }`,
            title: `${ comics[i].title }`,
            path: `${ comics[i].path }`,
            filename: `${ comics[i].path.slice(9) }`
        })
        await comic.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})