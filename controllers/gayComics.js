const GayComic = require('../models/gayComics')
const fs = require('fs');
const ObjectID = require('mongodb').ObjectId;

module.exports.index = async (req, res) => {
    const pageNumber = parseInt(req.params.page);

    if (!pageNumber) {
        res.redirect("gay/1")
    }
    const { limit = 15 } = req.query;
    const gayComics = await GayComic.find({})
        .sort({ "filename": -1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    res.render('gayComics/index', { gayComics, pageNumber })
    req.flash('success', "FOUND IT FOUND")
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

    const pageNumber = parseInt(req.params.page);

    // console.log(req.params)
    const { limit = 15 } = req.query;
    const gayComics = await GayComic.find({})
        .sort({ "filename": -1 })
        .limit(limit * 1).skip((pageNumber - 1) * limit);

    if (!ObjectID.isValid(req.params.id)) {
        req.session.returnTo = req.session.previousReturnTo;
        console.log('Invalid comic id, returnTo reset to:', req.session.returnTo);
        res.redirect('/comics/directory')
        return
    }
    const { id } = req.params;
    const gayComic = await GayComic.findById(req.params.id).populate({
        path: 'gayComments',
        populate: {
            path: 'author'
        }
    }).populate('author');


    const nextGayComic = await GayComic.find({ _id: { $gt: id } }).sort({ _id: 1 }).limit(1);
    const prevGayComic = await GayComic.find({ _id: { $lt: id } }).sort({ _id: -1 }).limit(1)
    // console.log(nextComic, prevComic)
    if (!gayComic) {
        req.flash('error', 'Cannot Find that gayComic');
        res.redirect('/comics/directory');
    }
    res.render('gayComics/showComic', { gayComic, nextGayComic, prevGayComic, pageNumber, gayComics });
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
        fs.unlink(`uploads/${ gayComic.filename }`, function (err) {
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
    fs.unlink(`uploads/${ gayComic.filename }`, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    });
    await GayComic.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted comic!');
    res.redirect(`/comics/gay/${ page }`);
}