const assert = require('assert');
const config = require('./../config/app.config.json');
const signal = require('./../utils/signal.js');

const LOG_LEVEL = {
	NONE: 0,
	ERROR: 1,
	WARNING: 2,
	MESSAGE: 3,
	TRACE: 4
};

class logService {
	static LEVEL = LOG_LEVEL;

	OnMessage = new signal("OnMessage"); // (int, ...<any>)=>()

	log(level, ...args) {
		assert(level != LOG_LEVEL.NONE);
		if (config.LOG_LEVEL >= level) {
			this.OnMessage.fire(level, ...args);
		}
	}
	error(...args) {
		this.log(LOG_LEVEL.ERROR, ...args);
	}
	warn(...args) {
		this.log(LOG_LEVEL.WARNING, ...args);
	}
	message(...args) {
		this.log(LOG_LEVEL.MESSAGE, ...args);
	}
	trace(...args) {
		this.log(LOG_LEVEL.TRACE, ...args);
	}
}



module.exports = logService;