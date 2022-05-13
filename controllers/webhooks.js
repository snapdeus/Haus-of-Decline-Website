const { eventEmitter, postEventEmitter } = require('../eventEmitters/eventEmitter');


const listener = require('../eventEmitters/eventListener');

module.exports.patreonWebhook = async (req, res) => {
    eventEmitter.emit('pubsub', req.body);
    res.sendStatus(200)
}

module.exports.patreonPost = async (req, res) => {
    postEventEmitter.emit('newPost', req.body);
    res.sendStatus(200)
}

module.exports.transistorWebhook = async (req, res) => {
    console.log(req.body);
    res.sendStatus(200)
}

module.exports.privateComic = async (req, res) => {
    eventEmitter.emit('privcom', req.body);
    res.sendStatus(200)
}