const Comic = require('../models/comics')

const ObjectID = require('mongodb').ObjectId;

module.exports.showDirectory = async (req, res) => {
    res.render('comics/directory')

};

