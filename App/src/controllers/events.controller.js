const createErrResponse = require('./../models/createErrorResponse.js');


class EventsController {
    #dependencies = {};

    constructor(logsService, dbService, twitchService) {
        this.#dependencies['logs'] = logsService;
        this.#dependencies['db'] = dbService;
        this.#dependencies['twitch'] = twitchService;
    }

    async all(request, response, next) {
        let logger = this.#dependencies['logs'];
        let db = this.#dependencies['db'];
        let events = await db.getAllEvents();

        response.json({
            success: true,
            events: events
        });
    };

    async between(request, response, next) {
        let logger = this.#dependencies['logs'];
        
        let query = request.query;
        let start = query['start'];
        let end = query['end'];
        logger.trace(`Fetching events between [${start}, ${end}]`);
        if (new Date(start) > new Date(end)) {
            response.status(400);
            response.json(createErrResponse("Start date must come before the end date"));
            return;
        }

        let db = this.#dependencies['db'];
        let events = await db.getEventsBetweenDates(start, end);

        response.json({
            success: true,
            events: events
        });
    };
}

module.exports = EventsController;