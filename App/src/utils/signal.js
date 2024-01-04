const { randomUUID } = require('node:crypto');

class signal {
	name;
	callbacks = {}; // <string, (...)=>()>

	constructor(name) {
		this.name = name;
	};

	connect(callback) {
		const nextId = randomUUID();
		this.callbacks[nextId] = callback;

		// return a disconnect token
		let disconnect = ()=>{
			delete this.callbacks[nextId];
		}
		return disconnect;
	};

	fire(...args) {
		for (const [_, callback] of Object.entries(this.callbacks)) {
			try {
				callback(...args);
			} catch(e) {
				console.error(`Signal(${this.name}) threw an error when firing : ${e.message}`);
				throw(e);
			}
		};
	}
}

module.exports = signal;