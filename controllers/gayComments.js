const GayComment = require('../models/gayComment');
const GayComic = require('../models/gayComics');

module.exports.createGayComment = async (req, res) => {
    console.log(req.params);

    const gayComic = await GayComic.findById(req.params.id)
    const gayComment = new GayComment(req.body.gayComment);


    gayComment.author = req.user._id;
    gayComic.gayComments.push(gayComment);
    await gayComment.save();
    await gayComic.save();
    req.flash('success', 'Created new gay comment!');
    console.log(req.session.previousReturnTo)
    res.redirect(req.session.previousReturnTo)
    // res.redirect(`/comics/${ pageNumber }/${ comic._id }`);
}

module.exports.deleteGayComment = async (req, res) => {
    const { id, gayCommentId, } = req.params;
    // const pageNumber = parseInt(req.params.page);
    console.log(req.params)
    await GayComic.findByIdAndUpdate(id, { $pull: { gayComments: gayCommentId } });
    await GayComment.findByIdAndDelete(gayCommentId);
    req.flash('success', 'Successfully deleted gay comment!');
    res.redirect(req.session.previousReturnTo)
    // res.redirect(`/comics/${ pageNumber }/${ id }`);
}

