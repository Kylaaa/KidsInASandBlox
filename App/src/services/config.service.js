const appConfig = require('../config/app.config.json');
const dbConfig = require('../config/db.config.json');

class configService {
    #configs = {
        app : appConfig,
        db : dbConfig
    }
    constructor() {}

    // prioritize environment variables over configuration
    getAppConfig(key) {
        return (process.env[key]) ? process.env[key] : this.#configs.app[key];
    }

    getDbConfig(key) {
        return (process.env[key]) ? process.env[key] : this.#configs.db[key];
    }
}

module.exports = configService;