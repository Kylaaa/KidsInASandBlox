const sqlite3 = require('sqlite3')

class dbService {
    #dependencies = {};
    #db;

    constructor(configService, logsService) {
        this.#dependencies['config'] = configService;
        this.#dependencies['logs'] = logsService;
        this.#db = this.#getDb();
    }

    
    #getDb() {
        let config = this.#dependencies['config'];
        let logger = this.#dependencies['logs'];

        if (config.getDbConfig("VERBOSE_DEBUGGING")) {
            sqlite3.verbose();
        }

        // When PATH_TO_DB is ":memory:", an anonymous in-memory db is created.
        // Its contents are lost upon close
        let db = new sqlite3.Database(config.getDbConfig("PATH_TO_DB"), config.getDbConfig("DB_MODE"), (err)=>{
            if (err) {
                logger.error(`DBService - threw an error while creating and connecting to the db :  ${err.toString()}`);
                throw err;
            };

            logger.message(`Connected to database`);
        });

        if (config.getDbConfig("VERBOSE_DEBUGGING")) {
            db.on('trace', (data)=>{
                logger.trace(data);
            });
        }

        for (let [name, fields] of Object.entries(config.getDbConfig("TABLE_SCHEMAS"))) {
            db.run(`CREATE TABLE ${name} (${fields.toString()})`);
        }

        return db;
    }

    
    addEvent(eventData) {
        // TODO : protect against replay attacks by only inserting events whose event id are unique
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


    setObservedEvents(eventNames) {
        return new Promise((resolve, reject)=>{
            let insertQuery = "INSERT INTO subscriptions (name) VALUES (?)";
            this.#db.run(insertQuery, eventNames.toString(), (err)=>{
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
    getObservedEvents() {
        return new Promise((resolve, reject) => {
            let selectQuery = "SELECT name FROM subscriptions ORDER BY name ASC";
            return this.#db.all(selectQuery, (err, rows)=>{
                if (err) {
                    let logger = this.#dependencies['logs'];
                    logger.error("Threw an error while getting all subscribed event names : ", err);
                    reject(err);
                }
                else {
                    let cleanedData = [];
                    for (let [i, dataObj] of Object.entries(rows)) {
                        cleanedData[i] = dataObj['name'];
                    }
                    resolve(cleanedData);
                }
            });
        });
    }


    close() {
        this.#db.close();
    }
}


module.exports = dbService;