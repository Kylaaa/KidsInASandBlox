/*
 * A service that communicates with Twitch's APIs and WebSockets and routes events outwards
 */

const config = require('./../config/app.config.json');
const webview = require("webview");
const uuidv4 = require('uuid').v4;
const constructUrl = require('./../utils/constructUrl.js')

class TwitchService {
    #dependencies = {};
    #scopes = [];

    constructor(logsService, dbService) {
        this.#dependencies['logs'] = logsService;
        this.#dependencies['db'] = dbService;
    }

    getScopes() {
        return scopes;
    }

    subscribe() {

    }
    unsubscribe() {
        
    }

    createOAuthWebview(redirectUrl) {
        let logger = this.#dependencies['logs']
        const args = {
            "response_type" : "token",
            "client_id" : config.CLIENT_ID,
            "redirect_uri" : redirectUrl,
            "scope" : this.#scopes.join('+'),
            "state" : uuidv4()
        };
        const targetUrl = constructUrl("https://id.twitch.tv/oauth2/authorize?", args);
        logger.trace(`Creating OAuth webview with URL : ${targetUrl}`);

        // the webview will redirect the the url specified in the 'redirect_uri' argument
        return webview.spawn({
            title : config.APP_NAME,
            width : config.LOGIN_VIEW_SIZE.WIDTH,
            height : config.LOGIN_VIEW_SIZE.HEIGHT,
            url : targetUrl
        });
    }
}


module.exports = TwitchService;