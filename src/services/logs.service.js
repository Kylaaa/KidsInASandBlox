const assert = require('assert');
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

	#dependencies = {};
	OnMessage = new signal("OnMessage"); // (int, ...<any>)=>()

	constructor(configService) {
		this.#dependencies['config'] = configService;
	}

	log(level, ...args) {
		let config = this.#dependencies['config'];
		assert(level != LOG_LEVEL.NONE);
		if (config.getAppConfig("LOG_LEVEL") >= level) {
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