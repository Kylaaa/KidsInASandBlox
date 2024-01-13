const sqlite3 = require('sqlite3')
const appConfig = require('../config/app.config.json');
const dbConfig = require('../config/db.config.json');

class dbService {
	#dependencies = {};
	#db;

	constructor(logsService) {
		if (dbConfig.VERBOSE_DEBUGGING) {
			sqlite3.verbose();
		}

		this.#dependencies['logs'] = logsService;
		this.#db = this.#getDb();
	}

	
	#getDb() {
		let logger = this.#dependencies['logs'];

		// When PATH_TO_DB is ":memory:", an anonymous in-memory db is created.
		// Its contents are lost upon close
		let db = new sqlite3.Database(dbConfig.PATH_TO_DB, dbConfig.DB_MODE, (err)=>{
			if (err) {
				logger.error(`DBService - threw an error while creating and connecting to the db :  ${err.toString()}`);
				throw err;
			};

			logger.message(`Connected to database`);
		});

		if (dbConfig.VERBOSE_DEBUGGING) {
			db.on('trace', (data)=>{
				logger.trace(data);
			});
		}

		let fields = [
			"id INTEGER PRIMARY KEY AUTOINCREMENT",
			"data TEXT",
			"received_date DATETIME DEFAULT CURRENT_TIMESTAMP",
		]
		db.run(`CREATE TABLE events (${fields.toString()})`);

		return db;
	}

	
	addEvent(eventData) {
		return new Promise((resolve, reject)=>{
			let insertQuery = "INSERT INTO events (data) VALUES (?)";
			this.#db.run(insertQuery, JSON.stringify(eventData), (err)=>{
				if (err) {
					let logger = this.#dependencies['logs'];
					logger.error(`Threw an error while adding an event (${JSON.stringify(eventData)}) : `, err);
					reject(err);
				}
				else {
					resolve();
				}
			});
		});
	}

	getAllEvents() {
		return new Promise((resolve, reject) => {
			let selectQuery = "SELECT data FROM events ORDER BY received_date ASC";
			return this.#db.all(selectQuery, (err, rows)=>{
				if (err) {
					let logger = this.#dependencies['logs'];
					logger.error("Threw an error while getting all events : ", err);
					reject(err);
				}
				else {
					let cleanedData = [];
					for (let [i, dataObj] of Object.entries(rows)) {
						cleanedData[i] = JSON.parse(dataObj['data']);
					}
					resolve(cleanedData);
				}
			});
		});
	}

	getEventsBetweenDates(start, end) {
		return new Promise((resolve, reject)=>{
			let startDateTime = new Date(start.toString()).toISOString();
			let endDateTime = new Date(end.toString()).toISOString();
			let selectQuery = "SELECT data FROM events " +
				"WHERE (received_date >= ?) AND (received_date <= ?) " +
				"ORDER BY received_date ASC";
			return this.#db.all(selectQuery, startDateTime, endDateTime, (err, rows)=>{
				if (err) {
					let logger = this.#dependencies['logs'];
					logger.error(`Threw an error while getting events between dates [${startDateTime}, ${endDateTime}]: `, err);
					reject(err);
				}
				else {
					resolve(rows);
				}
			});
		});
	}

	clearEvents() {
		return new Promise((resolve, reject) => {
			let clearQuery = `TRUNCATE TABLE events`;
			this.#db.run(clearQuery, (err)=>{
				if (err) {
					let logger = this.#dependencies['logs'];
					logger.error(`Threw an error while clearing the events table: `, err);
					reject(err);
				}
				else {
					resolve();
				}
			});
		});
	}

	close() {
		this.#db.close();
	}
}


module.exports = dbService;