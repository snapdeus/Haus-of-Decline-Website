const { number } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const TogetherComicSchema = new Schema({

    title: String,
    // path: String,
    filename: String,
    image: String,
    ordinality: Number,
    series: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    togetherComments: [
        {
            type: Schema.Types.ObjectId,
            ref: "TogetherComment"
        }
    ]
}, opts)


//this is the full text search stuff
// TogetherComicSchema.index({
//     title: 'text',
//     description: 'text',

// },
//     {
//         name: 'TextSearchIndex',
//         weights: {
//             title: 10,
//             description: 5
//         }

//     })

//enabled .ensureIndexes to add index the first time
module.exports = mongoose.model('TogetherComics', TogetherComicSchema);

//     .ensureIndexes(function (err) {
//     if (err) return handleError(err);
// });
