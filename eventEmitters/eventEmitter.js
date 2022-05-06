const { EventEmitter } = require("events");

eventEmitter = new EventEmitter;

postEventEmitter = new EventEmitter;

module.exports = { eventEmitter, postEventEmitter };

