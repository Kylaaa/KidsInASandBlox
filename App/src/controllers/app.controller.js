const createErrResponse = require('./../models/createErrorResponse.js');


class AppController {
    #dependencies = {};
    

    constructor(logsService, dbService, twitchService) {
        this.#dependencies['logs'] = logsService;
        this.#dependencies['db'] = dbService;
        this.#dependencies['twitch'] = twitchService;
    }

    // Provide a simple endpoint that the Studio Plugin can hit to quickly verify that the server is running
    isAlive(request, response, next) {
        response.json({ isAlive : 'true' })
    };

    // The Studio plugin will likely connect and disconnect repeatedly, this endpoint will serve to tell the plugin whether any initialization needs to happen
    checkConnection(request, response, next) {
        let ts = this.#dependencies['twitch'];
        response.json({
            authenticated: ts.isAuthenticated(),
            connected: ts.isSocketConnected()
        });
    };

    // Should be called once when Studio tells the app it is ready
    connectToTwitch(request, response, next) {
        let ts = this.#dependencies['twitch'];
        const isConnected = ts.isSocketConnected();
        if (!isConnected) {
            twitchWSClient.startTwitchClient();
            response.status(202).json({
                success : true,
                message : "Listening for events from Twitch..."
            });
        }
        else {
            response.status(400).json({
                success : false,
                message : "Already connected"
            });
        }
    };
}

module.exports = AppController;