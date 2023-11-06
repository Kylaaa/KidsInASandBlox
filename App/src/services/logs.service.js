const config = require('./../config/app.config.json');
const signal = require('./../utils/signal.js');

const LOG_LEVEL = {
	NONE: 0,
	ERROR: 1,
	WARNING: 2,
	MESSAGE: 3,
	TRACE: 4
};

const OnMessage = signal("OnMessage");

function log(level, ...args) {
	assert(level != LOG_LEVEL.NONE);
	if (config.LOG_LEVEL >= level) {
		OnMessage.fire(...args);
	}
}
function error(...args) {
	log(LOG_LEVEL.ERROR, args);
}
function warn(...args) {
	log(LOG_LEVEL.WARNING, args);
}
function trace(...args) {
	log(LOG_LEVEL.TRACE, args);
}

module.exports = {
	error : error,
	warn : warn,
	message : message,
	trace : trace,

	OnMessage : OnMessage
};