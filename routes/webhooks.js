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


