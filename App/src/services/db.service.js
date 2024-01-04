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
			"id INT AUTO_INCREMENT PRIMARY KEY",
			"data TEXT",
			"received_date DATETIME DEFAULT CURRENT_TIMESTAMP",
		]
		db.run(`CREATE TABLE ${dbConfig.EVENTS_TABLE_NAME} (${fields.toString()})`);

		return db;
	}

	
	addEvent(eventData) {
		let insertQuery = `INSERT INTO ${dbConfig.EVENTS_TABLE_NAME} (data) VALUES (${eventData})`;
		this.#db.run(insertQuery);
	}

	getEventsBetweenDates(start, end) {
		let selectQuery = `SELECT data FROM ${dbConfig.table_events} WHERE (received_date >= ${start}) AND (received_date <= ${end})`;
		this.#db.run(selectQuery);
	}

	clearEvents() {
		let clearQuery = `TRUNCATE TABLE ${dbConfig.table_events}`
		this.#db.run(clearQuery);
	}

	close() {
		this.#db.close();
	}
}


module.exports = dbService;