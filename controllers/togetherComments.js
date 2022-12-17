const TogetherComment = require('../models/togetherComment');
const TogetherComic = require('../models/togetherComics');

module.exports.createTogetherComment = async (req, res) => {
    console.log(req.params);

    const togetherComic = await TogetherComic.findById(req.params.id)
    const togetherComment = new TogetherComment(req.body.togetherComment);


    togetherComment.author = req.user._id;
    togetherComic.togetherComments.push(togetherComment);
    await togetherComment.save();
    await togetherComic.save();
    req.flash('success', 'Created new together comment!');
    console.log(req.session.previousReturnTo)
    res.redirect(req.session.previousReturnTo)
    // res.redirect(`/comics/${ pageNumber }/${ comic._id }`);
}

module.exports.deleteTogetherComment = async (req, res) => {
    const { id, togetherCommentId, } = req.params;
    // const pageNumber = parseInt(req.params.page);
    console.log(req.params)
    await TogetherComic.findByIdAndUpdate(id, { $pull: { togetherComments: togetherCommentId } });
    await TogetherComment.findByIdAndDelete(togetherCommentId);
    req.flash('success', 'Successfully deleted together comment!');
    res.redirect(req.session.previousReturnTo)
    // res.redirect(`/comics/${ pageNumber }/${ id }`);
}

