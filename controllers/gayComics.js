const GayComic = require('../models/gayComics')
const fs = require('fs');
const ObjectID = require('mongodb').ObjectId;

const axios = require('axios')
require('dotenv').config();
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }

module.exports.index = async (req, res) => {
    const pageNumber = parseInt(req.params.page);

    if (!pageNumber) {
        return res.redirect("/comics/gay/1")
    }
    const gayComic = await GayComic.findOne().sort({ "ordinality": -1 }).limit(1)
    //caution, total pages here is based on a uni-directional ordinality
    const totalPages = Math.ceil(gayComic.ordinality / 15);


    const { limit = 15 } = req.query;
    const gayComics = await GayComic.find({})
        .sort({ "ordinality": -1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    res.render('gayComics/index', { gayComics, pageNumber, totalPages })
    // req.flash('success', "FOUND IT FOUND")
};

module.exports.renderNewForm = (req, res) => {

    res.render('gayComics/gay/new');
}

module.exports.createGayComic = async (req, res) => {
    const gayComic = new GayComic(req.body.gayComic);
    gayComic.image = req.file.filename;
    gayComic.filename = req.file.filename
    gayComic.author = req.user._id;
    await gayComic.save();
    req.flash('success', 'Successfully made a new gayComic!');
    res.redirect(`/comics/gay/1/${ gayComic._id }`)
    // res.send(req.body)

};


module.exports.showGayComic = async (req, res) => {

    const getLatestShow = async () => {
        try {
            const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=1`
            const res = await axios.get(url, config)
            return res.data.data;
        } catch (e) {
            console.log(e);
        }

    };

    const episode = await getLatestShow();

    const pageNumber = parseInt(req.params.page);


    // console.log(req.params)
    const { limit = 15 } = req.query;
    const gayComics = await GayComic.find({})
        .sort({ "ordinality": -1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    if (!ObjectID.isValid(req.params.id)) {

        res.redirect(`/comics/gay/${ pageNumber }`);

        req.session.returnTo = req.session.previousReturnTo;
        console.log('Invalid comic id, returnTo reset to:', req.session.returnTo);
    }


    const { id } = req.params;
    // console.log(req.params)
    const gayComic = await GayComic.findById(req.params.id).populate({
        path: 'gayComments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    const comicOrd = gayComic.ordinality;

    const totalGayComics = await GayComic.countDocuments({ series: 1 })
    // console.log(totalGayComics)
    const totalPages = Math.ceil((totalGayComics + 1) / 15);

    // console.log(pageNumber, totalPages)
    if (pageNumber > totalPages) {
        res.redirect(`/comics/gay/${ totalPages }`)
    }


    const nextGayComic = await GayComic.find({ ordinality: { $lt: comicOrd } }).sort({ ordinality: -1 }).limit(1);
    const prevGayComic = await GayComic.find({ ordinality: { $gt: comicOrd } }).sort({ ordinality: 1 }).limit(1)

    if (!gayComic) {
        req.flash('error', 'Cannot Find that gayComic');
        res.redirect('/comics/directory');
    }
    res.render('gayComics/showComic', { gayComic, nextGayComic, prevGayComic, pageNumber, gayComics, episode });
    //TESTING THAT FLASH WORKS
    // req.flash('error', 'Cannot Find that Comic');
    // res.redirect('/');

}

module.exports.renderGayEditForm = async (req, res) => {
    const { id, page } = req.params;

    const gayComic = await GayComic.findById(id);
    if (!gayComic) {
        req.flash('error', 'Cannot Find that Comic');
        res.redirect(`comics/gay/${ page }/edit`);
    }

    res.render('gayComics/edit', { gayComic, page });
}

module.exports.updateGayComic = async (req, res) => {
    const { id, page } = req.params;
    // console.log(req.body);
    const gayComic = await GayComic.findByIdAndUpdate(id, { ...req.body.gayComic });

    if (req.file) {
        fs.unlink(`uploads/GayComics/${ gayComic.filename }`, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
        gayComic.image = req.file.filename;
        gayComic.filename = req.file.filename;

        await gayComic.save();
    }
    // if (req.body.deleteImages) {
    //     for (let filename of req.body.deleteImages) {
    //         await cloudinary.uploader.destroy(filename);
    //     }
    //     await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    // }
    req.flash('success', "Successfully updated Comic")
    res.redirect(`${ gayComic._id }`)
};

module.exports.deleteGayComic = async (req, res, next) => {
    const { id, page } = req.params;
    const gayComic = await GayComic.findById(id);
    fs.unlink(`uploads/GayComics/${ gayComic.filename }`, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    });
    await GayComic.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted comic!');
    res.redirect(`/comics/gay/${ page }`);
}