const createErrResponse = require('./../models/createErrorResponse.js');


class EventsController {
    #dependencies = {};

    constructor(logsService, dbService, sessionService, twitchService) {
        this.#dependencies['logs'] = logsService;
        this.#dependencies['db'] = dbService;
        this.#dependencies['session'] = sessionService;
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
        if (start === undefined || end === undefined) {
            response.status(400).json(createErrResponse("Missing start or end date"));
            return;
        }

        logger.trace(`Fetching events between [${start}, ${end}]`);
        if (new Date(start) > new Date(end)) {
            response.status(400).json(createErrResponse("Start date must come before the end date"));
            return;
        }

        let db = this.#dependencies['db'];
        let events = await db.getEventsBetweenDates(start, end);

        response.json({
            success: true,
            events: events
        });
    };

    async connectToTwitch(request, response, next) {
        let ts = this.#dependencies['twitch'];
        let ss = this.#dependencies['session'];

        if (!ss.isAuthenticated()) {
            response.status(401).json(createErrResponse("Cannot connect to Twitch before logging in"));
            return;
        }

        await ts.createWSConnection().then(
            ()=>{
                response.json({
                    success: true,
                    message: "Connected to Twitch successfully!"
                });
            },
            (err)=>{
                response.status(500).json(createErrResponse(e.message));
            }
        );        
    }

    async subscribeToAll(request, response, next) {
        let ts = this.#dependencies['twitch'];
        let ls = this.#dependencies['logs'];
        let ss = this.#dependencies['session'];

        if (ss.observedEvents.length == 0) {
            response.status(400).json(createErrResponse("There are no events to subscribe to."));
            return;
        } 

        let successfulSubscriptions = 0;
        try {
            ls.trace(ss.observedEvents);
            let allSubscriptionPromises = [];
            ss.observedEvents.forEach((eventName)=>{
                let subPromise = ts.subscribe(eventName).then(
                    ()=>{
                        successfulSubscriptions++;
                    },
                    (err)=>{
                        ls.error(err.message);
                        return Promise.resolve();
                    }
                );
                allSubscriptionPromises.push(subPromise);
            });

            await Promise.all(allSubscriptionPromises).then(()=>{
                let success = successfulSubscriptions == allSubscriptionPromises.length;
                let status = success ? 200 : 500;
                response.status(status).json({
                    success : success,
                    message : `Subscribed to ${successfulSubscriptions} / ${allSubscriptionPromises.length} events`
                });
            });
        }
        catch (e) {
            ls.error(e);
            response.status(401).json(createErrResponse(e.message));
        }
    }
}

module.exports = EventsController;