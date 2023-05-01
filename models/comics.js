const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ComicSchema = new Schema({
    title: String,
    description: String,
    // path: String,
    filename: String,
    image: String,
    ordinality: Number,
    series: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, opts);

ComicSchema.index({
    title: 'text',
    description: 'text',

},
    {
        name: 'TextSearchIndex',
        weights: {
            title: 10,
            description: 5
        }

    });


module.exports = mongoose.model('Comics', ComicSchema)
    .ensureIndexes(function (err) {
        if (err) return handleError(err);
    });
