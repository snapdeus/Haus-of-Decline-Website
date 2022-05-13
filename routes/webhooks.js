express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync')
const { patreonWebhook, transistorWebhook, patreonPost, privateComic } = require('../controllers/webhooks')

router.post('/transistorWebhook', catchAsync(transistorWebhook));

router.post('/patreonWebhook', catchAsync(patreonWebhook));

router.post('/patreonPost', catchAsync(patreonPost));

router.post('/privateComic', catchAsync(privateComic));


module.exports = router;


