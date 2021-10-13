const Comic = require('../models/comics')

module.exports.index = async (req, res) => {
    const comics = await Comic.find({})
        .sort({ "title": -1 })
    res.render('comics/index', { comics })
};
