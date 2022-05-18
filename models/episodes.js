const { number } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const EpisodeSchema = new Schema({
    title: String,
    description: String,
    summary: String,
    transistorID: String,
    episodeNumber: Number,
    image_url: String,
    date: String,
    stringNumber: String,
}, opts)

EpisodeSchema.index({
    title: 'text',
    description: 'text',
    summary: 'text',
    date: 'text',
    stringNumber: 'text'

},
    {
        name: 'EpisodeTextIndex',
        weights: {
            title: 10,
            summary: 7,
            description: 5,
            date: 4,
            stringNumber: 3,
        }

    })

//enabled .ensureIndexes to add index the first time
module.exports = mongoose.model('Episodes', EpisodeSchema);
//     .ensureIndexes(function (err) {
//     if (err) return console.log(err);
// });
