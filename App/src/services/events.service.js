/*
 * A service that holds onto the list of observed events.
 */

class eventsService {
	#dependencies = {};

	get logger() {
		return this.#dependencies['logs'];
	}
	get db() {
		return this.#dependencies['db'];
	}

	constructor(logsService, dbService){
		this.#dependencies['logs'] = logsService;
		this.#dependencies['db'] = dbService;
	}

	pushEvent(evt) {
		this.db.addEvent(evt);
	}

	getEvents(start, end) {
		let events = this.db.getEventsBetweenDates(start, end);
		return events;
	}
}

module.exports = eventsService;