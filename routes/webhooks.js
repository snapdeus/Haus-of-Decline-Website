express = require('express');
const router = express.Router(({ mergeParams: true }));
const catchAsync = require('../utils/catchAsync')
const { patreonWebhook, transistorWebhook } = require('../controllers/webhooks')

router.post('/transistorWebhook', catchAsync(transistorWebhook));

router.post('/patreonWebhook', catchAsync(patreonWebhook));


module.exports = router;