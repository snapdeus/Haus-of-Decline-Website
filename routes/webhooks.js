const express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync');
const { patreonWebhook, transistorWebhook, patreonPost, privateComic, tweetEpisode } = require('../controllers/webhooks');

router.post('/transistorWebhook', catchAsync(transistorWebhook));

router.post('/patreonWebhook', catchAsync(patreonWebhook));

router.post('/patreonPost', catchAsync(patreonPost));

router.post('/privateComic', catchAsync(privateComic));

router.post('/tweetEpisode', catchAsync(tweetEpisode));

module.exports = router;


// curl https://api.transistor.fm/v1/webhooks -X POST \
// -H "x-api-key: Y1FfLmM2MzlIi5NTb0qJDw" \
// -d event_name=episode_published \
// -d show_id=10944 \
// -d url=https://hausofdecline.com/webhooks/tweetEpisode


// curl https://api.transistor.fm/v1/webhooks -G -H "x-api-key: Y1FfLmM2MzlIi5NTb0qJDw" -d show_id = 10944

// curl https://api.transistor.fm/v1/webhooks -G \
//   -H "x-api-key: your_api_key" \
//   -d show_id=132543
  
// curl https://api.transistor.fm/v1/webhooks/806 -X DELETE \
//   -H "x-api-key: Y1FfLmM2MzlIi5NTb0qJDw"
  

//   curl https://api.transistor.fm/v1/webhooks/811 -X DELETE \
//   -H "x-api-key: Y1FfLmM2MzlIi5NTb0qJDw"