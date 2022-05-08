const GayComic = require('../models/gayComics')
const sanitizeHtml = require('sanitize-html');


module.exports.doSearch = async (req, res) => {
    const dirtySearchTerms = req.query.term;

    const searchTerms = sanitizeHtml(dirtySearchTerms, {
        allowedTags: [],
        allowedAttributes: {},
    });


    const unsortedGayComics = await GayComic.find({ $text: { $search: `${ searchTerms }` } })

    const gayComics = unsortedGayComics.sort(function (a, b) {
        return a.ordinality - b.ordinality
    })

    const maxNumber = await GayComic.findOne({})
        .sort({ ordinality: -1 })
    const totalGayComics = maxNumber.ordinality + 1
    const totalPages = Math.ceil(totalGayComics / 15)


    for (comic of gayComics) {
        const comicNumber = comic.ordinality

        if (comicNumber % 15 >= totalGayComics % 15 || comicNumber % 15 === 0) {
            comic.pageNumber = totalPages - Math.ceil(comicNumber / 15)
        } else if (comicNumber % 15 < totalGayComics % 15) {
            comic.pageNumber = totalPages - (Math.ceil(comicNumber / 15) - 1)
        }

    }



    res.render('search', { gayComics })
}