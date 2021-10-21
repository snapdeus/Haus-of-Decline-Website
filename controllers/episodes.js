const axios = require('axios')
require('dotenv').config();
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }

// const getNumOfEps = async () => {
//     try {
//         const res = await axios.get('https://api.transistor.fm/v1/episodes', config)
//         return res.data.data[0].attributes.number;
//     } catch (e) {
//         console.log(e);
//     }

// };

// const getShows = async () => {
//     try {
//         const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=10`

//         // + `${ await getNumOfEps() }`

//         const res = await axios.get(url, config)
//         console.log(res.data.meta)
//         return res.data.data;
//     } catch (e) {
//         console.log(e);
//     }

// };

// const getEpisode = async () => {
//     try {
//         const res = await axios.get('https://api.transistor.fm/v1/episodes/' + `${ req.params.id }`, config)
//         return res.data.data
//     } catch (e) {
//         console.log(e);
//     }
// }

module.exports.index = async (req, res) => {
    const pageNumber = req.params.page;
    if (!pageNumber) {
        res.redirect("episodes/1")
    }
    const getShows = async () => {
        try {
            const url = `https://api.transistor.fm/v1/episodes?pagination[page]=${ pageNumber }&pagination[per]=10`
            const res = await axios.get(url, config)

            return res.data
        } catch (e) {
            console.log(e);
        }

    };
    const allData = await getShows();
    const epList = allData.data

    const metaData = allData.meta
    res.render('episodes/index', { epList, metaData, pageNumber })
};

module.exports.showEpisode = async (req, res) => {
    const pageNumber = req.params.page;
    const id = req.params.id;
    const getEpisode = async () => {
        try {
            const res = await axios.get('https://api.transistor.fm/v1/episodes/' + `${ id }`, config)
            return res.data.data;
        } catch (e) {
            console.log(e);
        }

    }

    const episode = await getEpisode();
    res.render('episodes/showEpisode', { episode, pageNumber })

}

