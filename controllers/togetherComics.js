const TogetherComic = require('../models/togetherComics')
const fs = require('fs');
const ObjectID = require('mongodb').ObjectId;

const axios = require('axios')
require('dotenv').config();
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }

module.exports.index = async (req, res) => {
    const pageNumber = parseInt(req.params.page);

    if (!pageNumber) {
        return res.redirect("/comics/together/1")
    }
    const togetherComic = await TogetherComic.findOne().sort({ "ordinality": 1 }).limit(1)
    //caution, total pages here is based on a uni-directional ordinality
    const totalPages = Math.ceil(togetherComic.ordinality / 15);


    const { limit = 15 } = req.query;
    const togetherComics = await TogetherComic.find({})
        .sort({ "ordinality": 1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    res.render('togetherComics/index', { togetherComics, pageNumber, totalPages })
    req.flash('success', "FOUND IT FOUND")
};

module.exports.renderNewForm = (req, res) => {

    res.render('togetherComics/together/new');
}

module.exports.createTogetherComic = async (req, res) => {
    const togetherComic = new TogetherComic(req.body.togetherComic);
    togetherComic.image = req.file.filename;
    togetherComic.filename = req.file.filename
    togetherComic.author = req.user._id;
    await togetherComic.save();
    req.flash('success', 'Successfully made a new togetherComic!');
    res.redirect(`/comics/together/1/${ togetherComic._id }`)
    // res.send(req.body)

};


module.exports.showTogetherComic = async (req, res) => {

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
    const togetherComics = await TogetherComic.find({})
        .sort({ "ordinality": 1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    if (!ObjectID.isValid(req.params.id)) {

        res.redirect(`/comics/together/${ pageNumber }`);

        req.session.returnTo = req.session.previousReturnTo;
        console.log('Invalid comic id, returnTo reset to:', req.session.returnTo);
    }


    const { id } = req.params;
    // console.log(req.params)
    const togetherComic = await TogetherComic.findById(req.params.id).populate({
        path: 'togetherComments',
        populate: {
            path: 'author'
        }
    }).populate('author');

    const comicOrd = togetherComic.ordinality;

    const totalTogetherComics = await TogetherComic.countDocuments({ series: 1 })
    // console.log(totalTogetherComics)
    const totalPages = Math.ceil((totalTogetherComics + 1) / 15);

    // console.log(pageNumber, totalPages)
    if (pageNumber > totalPages) {
        res.redirect(`/comics/together/${ totalPages }`)
    }


    const nextTogetherComic = await TogetherComic.find({ ordinality: { $lt: comicOrd } }).sort({ ordinality: -1 }).limit(1);
    const prevTogetherComic = await TogetherComic.find({ ordinality: { $gt: comicOrd } }).sort({ ordinality: 1 }).limit(1)

    if (!togetherComic) {
        req.flash('error', 'Cannot Find that togetherComic');
        res.redirect('/comics/directory');
    }
    res.render('togetherComics/showTogetherComic', { togetherComic, nextTogetherComic, prevTogetherComic, pageNumber, togetherComics, episode });
    //TESTING THAT FLASH WORKS
    // req.flash('error', 'Cannot Find that Comic');
    // res.redirect('/');

}

module.exports.renderTogetherEditForm = async (req, res) => {
    const { id, page } = req.params;

    const togetherComic = await TogetherComic.findById(id);
    if (!togetherComic) {
        req.flash('error', 'Cannot Find that Comic');
        res.redirect(`comics/together/${ page }/edit`);
    }

    res.render('togetherComics/edit', { togetherComic, page });
}

module.exports.updateTogetherComic = async (req, res) => {
    const { id, page } = req.params;
    // console.log(req.body);
    const togetherComic = await TogetherComic.findByIdAndUpdate(id, { ...req.body.togetherComic });

    if (req.file) {
        fs.unlink(`uploads/TogetherComics/${ togetherComic.filename }`, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
        togetherComic.image = req.file.filename;
        togetherComic.filename = req.file.filename;

        await togetherComic.save();
    }
    // if (req.body.deleteImages) {
    //     for (let filename of req.body.deleteImages) {
    //         await cloudinary.uploader.destroy(filename);
    //     }
    //     await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    // }
    req.flash('success', "Successfully updated Comic")
    res.redirect(`${ togetherComic._id }`)
};

module.exports.deleteTogetherComic = async (req, res, next) => {
    const { id, page } = req.params;
    const togetherComic = await TogetherComic.findById(id);
    fs.unlink(`uploads/TogetherComics/${ togetherComic.filename }`, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    });
    await TogetherComic.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted comic!');
    res.redirect(`/comics/together/${ page }`);
}