const Comic = require('../models/comics')
const GayComic = require('../models/gayComics')

const ObjectID = require('mongodb').ObjectId;

module.exports.showDirectory = async (req, res) => {
    const comic = await Comic.findOne({})
    const gayComic = await GayComic.findOne().sort({ ordinality: -1 }).limit(1)
    res.render('comics/directory', { comic, gayComic })

};

