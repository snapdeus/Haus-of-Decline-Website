const Comic = require('../models/comics')
const fs = require('fs');
const ObjectID = require('mongodb').ObjectId;

const axios = require('axios')
require('dotenv').config();
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }

module.exports.index = async (req, res) => {
    const pageNumber = parseInt(req.params.page);

    if (!pageNumber) {
        return res.redirect("/comics/cod/1")
    }


    const { limit = 15 } = req.query;
    const comics = await Comic.find({})
        .sort({ "filename": -1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    res.render('comics/index', { comics, pageNumber })
    // req.flash('success', "FOUND IT FOUND")
};

module.exports.renderNewForm = (req, res) => {

    res.render('comics/cod/new');
}

module.exports.createComic = async (req, res) => {
    const comic = new Comic(req.body.comic);
    comic.image = req.file.filename;
    comic.filename = req.file.filename
    comic.author = req.user._id;
    await comic.save();
    req.flash('success', 'Successfully made a new comic!');
    res.redirect(`/comics/cod/1/${ comic._id }`)
    // res.send(req.body)

};


module.exports.showComic = async (req, res) => {

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
    const comics = await Comic.find({})
        .sort({ "filename": -1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    if (!ObjectID.isValid(req.params.id)) {
        req.session.returnTo = req.session.previousReturnTo;
        console.log('Invalid comic id, returnTo reset to:', req.session.returnTo);
        res.redirect(`/comics/cod/${ pageNumber }`);
        return
    }
    const { id } = req.params;
    const comic = await Comic.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    const totalComics = await Comic.countDocuments({ series: 0 })

    const totalPages = Math.ceil((totalComics + 1) / 15);


    if (pageNumber > totalPages) {
        res.redirect(`/comics/cod/${ totalPages }`)
    }



    const nextComic = await Comic.find({ _id: { $gt: id } }).sort({ _id: 1 }).limit(1);
    const prevComic = await Comic.find({ _id: { $lt: id } }).sort({ _id: -1 }).limit(1)
    // console.log(nextComic, prevComic)
    if (!comic) {
        req.flash('error', 'Cannot Find that Comic');
        res.redirect('/comics/directory');
    }
    res.render('comics/showComic', { comic, nextComic, prevComic, pageNumber, comics, episode });
    //TESTING THAT FLASH WORKS
    // req.flash('error', 'Cannot Find that Comic');
    // res.redirect('/');

}

module.exports.renderEditForm = async (req, res) => {
    const { id, page } = req.params;

    const comic = await Comic.findById(id);
    if (!comic) {
        req.flash('error', 'Cannot Find that Comic');
        res.redirect(`comics/cod/${ page }/edit`);
    }

    res.render('comics/edit', { comic, page });
}

module.exports.updateComic = async (req, res) => {
    const { id, page } = req.params;
    // console.log(req.body);
    const comic = await Comic.findByIdAndUpdate(id, { ...req.body.comic });

    if (req.file) {
        fs.unlink(`uploads/${ comic.filename }`, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
        comic.image = req.file.filename;
        comic.filename = req.file.filename;

        await comic.save();
    }
    // if (req.body.deleteImages) {
    //     for (let filename of req.body.deleteImages) {
    //         await cloudinary.uploader.destroy(filename);
    //     }
    //     await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    // }
    req.flash('success', "Successfully updated Comic")
    res.redirect(`${ comic._id }`)
};

module.exports.deleteComic = async (req, res, next) => {
    const { id, page } = req.params;
    const comic = await Comic.findById(id);
    fs.unlink(`uploads/${ comic.filename }`, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    });
    await Comic.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted comic!');
    res.redirect(`/comics/cod/${ page }`);
}