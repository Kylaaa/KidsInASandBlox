const createErrResponse = require('./../models/createErrorResponse.js');

class AppController {
    #dependencies = {};

    constructor(logsService, dbService, sessionService, twitchService) {
        this.#dependencies['logs'] = logsService;
        this.#dependencies['db'] = dbService;
        this.#dependencies['session'] = sessionService;
        this.#dependencies['twitch'] = twitchService;
    }

    // Provide a simple endpoint that the Studio Plugin can hit to quickly verify that the server is running
    // The Studio plugin will likely connect and disconnect repeatedly, this endpoint will serve to tell the plugin whether any initialization needs to happen
    checkStatus(request, response, next) {
        let ss = this.#dependencies['session'];

        response.json({
            authenticated: ss.isAuthenticated(),
            connected: ss.isSocketConnected()
        });
    };

    // Opens a webview to allow the user to login
    connectToTwitch(request, response, next) {
        // TODO : validate authentication status before showing the webview
        let ts = this.#dependencies['twitch'];

        let targetUrl = "http://localhost:3000/auth/login";
        ts.createOAuthWebview(targetUrl);
        response.status(202).json({
            success: true
        });
    };
}

module.exports = AppController;