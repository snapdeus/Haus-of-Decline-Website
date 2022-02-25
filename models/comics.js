const { number } = require('joi');
const mongoose = require('mongoose')
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
}, opts)


module.exports = mongoose.model('Comics', ComicSchema)