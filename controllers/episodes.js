const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.TRANSISTOR_API_KEY;
const config = { headers: { 'x-api-key': apiKey } };

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

//BELOW FIX NO LONGER NEEDED
// function removeObjectWithId(arr, id) {
//     const objWithIdIndex = arr.findIndex((obj) => obj.id === id);

//     if (objWithIdIndex > -1) {
//         arr.splice(objWithIdIndex, 1);
//     }

//     return arr;
// }
module.exports.index = async (req, res) => {
    const pageNumber = req.params.page;

    if (!pageNumber) {

        return res.redirect("/episodes/1");
    }
    const getShows = async () => {
        try {

            const url = `https://api.transistor.fm/v1/episodes?pagination[page]=${ pageNumber }&pagination[per]=10`;
            const res = await axios.get(url, config);

            return res.data;
        } catch (e) {
            console.log(e);
        }

    };
    const allData = await getShows();

    const epList = allData.data;

    const metaData = allData.meta;
    res.render('episodes/index', { epList, metaData, pageNumber });
};

module.exports.showEpisode = async (req, res) => {
    const pageNumber = req.params.page;
    const id = req.params.id;
    const getEpisode = async () => {
        try {
            const res = await axios.get('https://api.transistor.fm/v1/episodes/' + `${ id }`, config);

            return res.data.data;
        } catch (e) {
            console.log(e);
            return;
        }

    };

    const episode = await getEpisode();

    if (!episode) {
        req.session.returnTo = req.session.previousReturnTo;
        console.log('Invalid ep id, returnTo reset to:', req.session.returnTo);
        res.redirect('/episodes/1');
        return;
    }

    res.render('episodes/showEpisode', { episode, pageNumber });

};

// 1304138;

// 10944;

// curl https://api.transistor.fm/v1/episodes/1304138 -G \
//   -H "x-api-key: Y1FfLmM2MzlIi5NTb0qJDw" \
//   -d "include[]=show" \
//   -d "fields[show][]=title" \
//   -d "fields[show][]=summary"