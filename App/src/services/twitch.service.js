/*
 * A service that communicates with Twitch's APIs and WebSockets and routes events outwards
 */

const webview = require("webview");
const uuidv4 = require('uuid').v4;

const config = require('./../config/app.config.json');
const constructUrl = require('./../utils/constructUrl.js');
const signal = require('./../utils/signal.js');
const twitchWSClient = require('./../utils/twitchWSClient.js');
const twitchEventData = require('./../config/twitch.events.json');

class TwitchService {
    #dependencies = {};
    #authToken = "";
    #wsClient = new twitchWSClient();
    #expectedStateString = "";
    #observedEventData = {};
    #eventData = twitchEventData;

    constructor(logsService, dbService) {
        this.#dependencies['logs'] = logsService;
        this.#dependencies['db'] = dbService;

        this.#wsClient.onConnection.connect((connection)=>{
            logsService.trace("Connected to Twitch!");
        });
        this.#wsClient.onMessage.connect((message)=>{
            logsService.trace(`Received message from Twitch : ${message}`);
        });
        this.#wsClient.onError.connect((err)=>{
            logsService.error(`Received error from Twitch : ${message}`);
        });
        this.#wsClient.onClose.connect(()=>{
            logsService.trace(`Received close signal from Twitch`);
        });
    }

    close() {
        
    }
    isAuthenticated() {
        return this.#authToken != "";
    }
    isSocketConnected() {
        return this.#wsClient.isConnected;
    }

    #getRequestHeaders() {
        return {
            'Authorization' : 'Bearer ' + this.#authToken,
            'Client-Id' : config.CLIENT_ID,
            'Content-Type' : "application/vnd.twitchtv.v5+json"
        }
    }

    #getConditionData(eventName) {

    }

    getTwitchEventData(){
        return twitchEventData;
    }

    subscribe(userId, eventName) {
        let name = eventData.name
        return fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
            method: "POST",
            headers: this.#getRequestHeaders(),
            body: JSON.stringify({
                type: name,
                version: version,
                condition: {
                    user_id: userId
                },
                transport: {
                    method: "websocket"
                }
            })
        })

        /*
        response :
        {
            data: [],
            id: <string>,
            status: <string>, // possible values : "enabled" "webhook_callback_verification_pending"
            type : <string>,
            version,
            condition,
            created_at,
            transport,
            method,
            session_id,
            connected_at
        }

        codes :
        202 - Accepted
        400 - Bad Request
        */
    }
    unsubscribe(userId, eventName) {
        return fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
            method: "DELETE",
            headers: this.#getRequestHeaders(),
            body: JSON.stringify({
                type: event,
                version: version,
                condition: {
                    user_id: userId,
                },
                transport: {
                    method: "websocket"
                }
            })
        })
    }

    createOAuthWebview(scopes) {
        this.#expectedStateString = uuidv4();

        // The redirct_uri must match one of the urls provided to the Developer Dashboard
        const args = {
            "response_type" : "token",
            "client_id" : config.CLIENT_ID,
            "redirect_uri" : "http://localhost:3000/auth/handleLogin",
            "scope" : scopes.join('+'),
            "state" : this.#expectedStateString
        };
        // the webview will redirect the the url specified in the 'redirect_url' argument
        const targetUrl = constructUrl("https://id.twitch.tv/oauth2/authorize?", args);
        return webview.spawn({
            title : config.APP_NAME,
            width : config.LOGIN_VIEW_SIZE.WIDTH,
            height : config.LOGIN_VIEW_SIZE.HEIGHT,
            url : targetUrl
        });
    }

    setAuthToken(stateString, token) {
        let logger = this.#dependencies['logs'];
        if (this.#expectedStateString != stateString) {
            logger.error("Attempted to set auth token with invalid state. Expected ${}, but received ${}");
            throw new Error("Attempted to set auth token with invalid state string.");
        }
        this.#authToken = token;
        logger.trace("Auth token set successfully!");
    }

    createWSConnection() {
        this.#wsClient.start();
    }

    getUserId(userName) {
        return fetch("https://api.twitch.tv/helix/users", {
            method: "GET",
            headers: this.#getRequestHeaders(),
            body: JSON.stringify({
                type: name,
                version: version,
                condition: {
                    user_id: userId
                },
                transport: {
                    method: "websocket"
                },
            })
        });
    }
}


module.exports = TwitchService;