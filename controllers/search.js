const GayComic = require('../models/gayComics');
const Comic = require('../models/comics');
const Episode = require('../models/episodes');
const sanitizeHtml = require('sanitize-html');


module.exports.doSearch = async (req, res) => {
    const dirtySearchTerms = req.query.term;
    const searchTerms = sanitizeHtml(dirtySearchTerms, {
        allowedTags: [],
        allowedAttributes: {},
    });
    const unsortedGayComics = await GayComic.find({ $text: { $search: `${ searchTerms }` } });
    const unsortedEpisodes = await Episode.find({ $text: { $search: `${ searchTerms }` } });
    const unsortedComics = await Comic.find({ $text: { $search: `${ searchTerms }` } });
    // console.log(unsortedEpisodes)

    const gayComics = unsortedGayComics.sort(function (a, b) {
        return a.ordinality - b.ordinality;
    });

    const comics = unsortedComics.sort(function (a, b) {
        return a.ordinality - b.ordinality;
    });

    const episodes = unsortedEpisodes.sort(function (a, b) {
        return a.episodeNumber - b.episodeNumber;
    });

    const maxEpisode = await Episode.findOne({})
        .sort({ episodeNumber: -1 });
    const totalEpisodes = maxEpisode.episodeNumber;
    const totalEpisodePages = Math.ceil(totalEpisodes / 10);




    for (episode of episodes) {
        const epNumber = episode.episodeNumber;

        if (epNumber % 10 >= totalEpisodes % 10 || epNumber % 10 === 0) {
            episode.pageNumber = totalEpisodePages - Math.ceil(epNumber / 10);
        } else if (epNumber % 10 < totalEpisodes % 10) {
            episode.pageNumber = totalEpisodePages - (Math.ceil(epNumber / 10) - 1);
        }
    }

    const maxGayNumber = await GayComic.findOne({})
        .sort({ ordinality: -1 });
    const totalGayComics = maxGayNumber.ordinality + 1;
    const totalGayPages = Math.ceil(totalGayComics / 15);


    for (comic of gayComics) {
        const comicNumber = comic.ordinality;

        if (comicNumber % 15 >= totalGayComics % 15 || comicNumber % 15 === 0) {
            comic.pageNumber = totalGayPages - Math.ceil(comicNumber / 15);
        } else if (comicNumber % 15 < totalGayComics % 15) {
            comic.pageNumber = totalGayPages - (Math.ceil(comicNumber / 15) - 1);
        }

    }

    const maxComicNumber = await Comic.findOne({})
        .sort({ ordinality: -1 });
    const totalComics = maxComicNumber.ordinality + 1;
    const totalComicPages = Math.ceil(totalComics / 15);
    for (comic of comics) {
        const comicNumber = comic.ordinality;

        if (comicNumber % 15 >= totalComics % 15 || comicNumber % 15 === 0) {
            comic.pageNumber = totalComicPages - Math.ceil(comicNumber / 15);
        } else if (comicNumber % 15 < totalComics % 15) {
            comic.pageNumber = totalComicPages - (Math.ceil(comicNumber / 15) - 1);
        }

    }






    res.render('search', { gayComics, episodes, comics, searchTerms });
};