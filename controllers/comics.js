const Comic = require('../models/comics')
const fs = require('fs');
const im = require('imagemagick');
const ObjectID = require('mongodb').ObjectId;

module.exports.index = async (req, res) => {
    const pageNumber = parseInt(req.params.page);

    if (!pageNumber) {
        res.redirect("comics/1")
    }
    const { limit = 15 } = req.query;
    const comics = await Comic.find({})
        .sort({ "filename": -1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    res.render('comics/index', { comics, pageNumber })
    req.flash('success', "FOUND IT FOUND")
};

module.exports.renderNewForm = (req, res) => {

    res.render('comics/new');
}

module.exports.createComic = async (req, res) => {
    const comic = new Comic(req.body.comic);
    comic.image = req.file.filename;
    comic.filename = req.file.filename
    comic.author = req.user._id;
    await comic.save();
    req.flash('success', 'Successfully made a new comic!');
    res.redirect(`/comics/1/${ comic._id }`)
    // res.send(req.body)

};


module.exports.showComic = async (req, res) => {

    const pageNumber = parseInt(req.params.page);

    console.log(req.params)
    const { limit = 15 } = req.query;
    const comics = await Comic.find({})
        .sort({ "filename": -1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    if (!ObjectID.isValid(req.params.id)) {
        req.session.returnTo = req.session.previousReturnTo;
        console.log('Invalid campground show id, returnTo reset to:', req.session.returnTo);
    }
    const { id } = req.params;
    const comic = await Comic.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');


    const nextComic = await Comic.find({ _id: { $gt: id } }).sort({ _id: 1 }).limit(1);
    const prevComic = await Comic.find({ _id: { $lt: id } }).sort({ _id: -1 }).limit(1)
    // console.log(nextComic, prevComic)
    if (!comic) {
        req.flash('error', 'Cannot Find that Comic');
        res.redirect('/comics');
    }
    res.render('comics/showComic', { comic, nextComic, prevComic, pageNumber, comics });
    //TESTING THAT FLASH WORKS
    // req.flash('error', 'Cannot Find that Comic');
    // res.redirect('/');

}

module.exports.renderEditForm = async (req, res) => {
    const { id, page } = req.params;

    const comic = await Comic.findById(id);
    if (!comic) {
        req.flash('error', 'Cannot Find that Comic');
        res.redirect(`comics/${ page }/edit`);
    }

    res.render('comics/edit', { comic });
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
    res.redirect(`comics/${ page }/${ comic._id }`)
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
    res.redirect(`/comics/${ page }`);
}