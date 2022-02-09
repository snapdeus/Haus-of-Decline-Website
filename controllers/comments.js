const Comment = require('../models/comment');
const Comic = require('../models/comics');

module.exports.createComment = async (req, res) => {
    const comic = await Comic.findById(req.params.id);
    const comment = new Comment(req.body.review);
    comment.author = req.user._id;
    comic.comments.push(comment);
    await comment.save();
    await comic.save();
    req.flash('success', 'Created new comment!');
    res.redirect(`/comics/${ comic._id }`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Comic.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted comment!');
    res.redirect(`/comics/${ id }`);
}

