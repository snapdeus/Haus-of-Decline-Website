const axios = require('axios')
require('dotenv').config();
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } }

const getNumOfEps = async () => {
    try {
        const res = await axios.get('https://api.transistor.fm/v1/episodes', config)
        return res.data.data[0].attributes.number;
    } catch (e) {
        console.log(e);
    }

};

const getShows = async () => {
    try {
        const url = `https://api.transistor.fm/v1/episodes?pagination[page]=1&pagination[per]=` + `${ await getNumOfEps() }`
        const res = await axios.get(url, config)
        return res.data.data;
    } catch (e) {
        console.log(e);
    }

};

const getEpisode = async (req, res) => {
    try {
        const res = await axios.get('https://api.transistor.fm/v1/episodes/' + `${ req.params.id }`, config)
        return res.data.data
    } catch (e) {
        console.log(e);
    }
}

module.exports.index = async (req, res) => {
    const epList = await getShows();
    res.render('episodes/index', { epList })
};

module.exports.showEpisode = async (req, res) => {
    const episode = await getEpisode();
    if (!episode) {
        req.flash('error', 'Cannot Find that Episode');
        res.redirect('/episodes');
    }
    res.render('episodes/showEpisode', { episode })

}



