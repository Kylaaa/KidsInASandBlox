/*
 * A service that communicates with Twitch's APIs and WebSockets and routes events outwards
 */

const webview = require("webview");
const uuidv4 = require('uuid').v4;

const constructUrl = require('./../utils/constructUrl.js');
const signal = require('./../utils/signal.js');
const twitchWSClient = require('./../utils/twitchWSClient.js');
const twitchEventData = require('./../config/twitch.events.json');

class twitchService {
    #dependencies = {};
    #wsClient = null;
    #eventData = twitchEventData;

    constructor(configService, logsService, sessionService, dbService) {
        this.#dependencies['config'] = configService;
        this.#dependencies['logs'] = logsService;
        this.#dependencies['session'] = sessionService;
        this.#dependencies['db'] = dbService;

        this.#wsClient = new twitchWSClient(configService, logsService);
        this.#wsClient.onConnection.connect((connection)=>{
            logsService.trace("Connected to Twitch!");
        });
        this.#wsClient.onMessage.connect((id, time, message)=>{
            logsService.trace(`Received message from Twitch :${id} - ${message}`);
            dbService.addEvent(message);
        });
        this.#wsClient.onError.connect((err)=>{
            logsService.error(`Received error from Twitch : ${message}`);
        });
        this.#wsClient.onClose.connect(()=>{
            logsService.trace(`Received close signal from Twitch`);
            sessionService.sessionToken = null;
        });
    }

    close() {
        
    }

    #assertAuthenticatedAndConnected() {
        let ss = this.#dependencies['session'];

        if (!ss.isAuthenticated()){
            throw new Error("Cannot subscribe to events before logging in.");
        }
        if (!this.#wsClient.isConnected || !ss.isSocketConnected()) {
            throw new Error("Cannot subscribe to events without a live web-socket connection.");
        }
        if (ss.userData === undefined) {
            throw new Error("Cannot subscribe to events before fetching information about the current user.");
        }
    }

    #getRequestHeaders() {
        let config = this.#dependencies['config'];
        let ss = this.#dependencies['session'];

        return {
            'Authorization' : `Bearer ${ss.authToken}`,
            'Client-Id' : config.getAppConfig("CLIENT_ID"),
            'Content-Type' : "application/json"
        }
    }

    #getConditionData(eventName) {
        let ls = this.#dependencies['logs'];
        let ss = this.#dependencies['session'];

        let event = this.#eventData[eventName];
        if (event === undefined) {
            throw new Error(`Cannot find any information about ${eventName}`);
        }

        let conditionData = {};
        event.condition.forEach((key)=>{
            switch(key) {
                case ('broadcaster_user_id') : 
                    conditionData[key] = ss.userData.id;
                    break;
                case ('to_broadcaster_user_id') :
                    conditionData[key] = ss.userData.id;
                    break;
                case ('moderator_user_id') :
                    conditionData[key] = ss.userData.id;
                    break;
                default :
                    let msg = `Unhandled request regarding condition data for ${eventName} : ${key}`;
                    ls.error(msg);
                    throw new Error(msg);
            }
        });

        return conditionData;
    }

    #getTransportData() {
        let ss = this.#dependencies['session'];
        return {
            method: "websocket",
            session_id: ss.sessionToken
        }
    }

    createWSConnection() {
        let ls = this.#dependencies['logs'];
        let ss = this.#dependencies['session'];
        let ws = this.#wsClient;

        return new Promise((resolve, reject)=>{
            var disconnectWelcomeCallback;
            var disconnectErrCallback;
            disconnectWelcomeCallback = ws.onWelcome.connect((id, time, payload)=>{
                // todo : handle possible reconnect_url field

                resolve(payload.session.id);
                disconnectWelcomeCallback();
                disconnectErrCallback();
            });
            disconnectErrCallback = ws.onError.connect((err)=>{
                reject(err);
                disconnectWelcomeCallback();
                disconnectErrCallback();
            });

            try {
                ws.start();
            }
            catch(e) {
                disconnectErrCallback();
                disconnectWelcomeCallback();
                reject(e.message);
            }
        }).then((token)=>{
            ls.trace(`Session token set to ${token}`);
            ss.sessionToken = token;
        });
    }

    getTwitchEventData(){
        return twitchEventData;
    }
    getTwitchEventDataByScope() {
        let scopes = {}; // <permission-name, array<eventData>>

        // sort the scopes before pushing events in
        let sortedScopes = [];
        for (let [name, event] of Object.entries(twitchEventData)) {
            sortedScopes.push(event.scope);
        }
        sortedScopes.sort();
        sortedScopes.forEach((name)=>{
            if (scopes[name] === undefined) {
                scopes[name] = [];
            };
        });

        // insert all of the events into the "sorted" dictionary
        for (let [name, event] of Object.entries(twitchEventData)) {
            scopes[event.scope].push(event);
        };

        return scopes;
    }

    subscribe(eventName) {
        let config = this.#dependencies['config'];
        let ls = this.#dependencies['logs'];
        let ss = this.#dependencies['session'];
        this.#assertAuthenticatedAndConnected();

        let event = this.#eventData[eventName];
        if (event === undefined) {
            throw new Error(`Cannot subscribe to an event named ${eventName}.`);
        }

        let name = event.id;
        if (name === undefined) {
            throw new Error(`Event data for ${eventName} is missing an id.`);
        }

        let version = event.version;
        if (version === undefined) {
            throw new Error(`Event data for ${eventName} is missing a version number.`);
        }

        let headers = this.#getRequestHeaders();
        let conditions = this.#getConditionData(eventName);
        let transport = this.#getTransportData();

        return fetch(`${config.getAppConfig("TWITCH_API_HOST")}/eventsub/subscriptions`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                type: name,
                version: version,
                condition: conditions,
                transport: transport
            })
        }).then((response)=>{
            //ls.trace(response);
            if (response.ok) {
                return response;
            }

            let details = [`Something went wrong subscribing to ${eventName}...`];
            for (let [key, value] of Object.entries(response)) {
                details.push(` - ${key} : ${value}`);
            }
            let message = details.join(`\n`);
            ls.error(message);
            throw new Error(message);
        });
    }
    unsubscribe(eventName) {
        let config = this.#dependencies['config'];
        let ss = this.#dependencies['session'];
        this.#assertAuthenticatedAndConnected();

        let event = this.#eventData[eventName];
        if (event === undefined) {
            throw new Error(`Cannot subscribe to an event named ${eventName}.`);
        }

        let name = event.id;
        if (name === undefined) {
            throw new Error(`Event data for ${eventName} is missing an id.`);
        }

        let version = event.version;
        if (version === undefined) {
            throw new Error(`Event data for ${eventName} is missing a version number.`);
        }

        let headers = this.#getRequestHeaders();
        let conditions = this.#getConditionData(eventName);

        return fetch(`${config.getAppConfig("TWITCH_API_HOST")}/eventsub/subscriptions`, {
            method: "DELETE",
            headers: headers,
            body: JSON.stringify({
                type: event,
                version: version,
                condition: conditions,
                transport: {
                    method: "websocket"
                }
            })
        }).then((response)=>{
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.json());
        });
    }

    createOAuthLoginUrl(scopes, redirectUrl) {
        let config = this.#dependencies['config'];
        let ss = this.#dependencies['session'];
        ss.expectedStateString = uuidv4();

        // The redirct_uri must match one of the urls provided to the Developer Dashboard
        const args = {
            "response_type" : "token",
            "client_id" : config.getAppConfig("CLIENT_ID"),
            "redirect_uri" : config.getAppConfig("TWITCH_OAUTH_REDIRECT_URL"),
            "scope" : scopes.join(' '),
            "state" : ss.expectedStateString
        };

        // the webview will redirect the the url specified in the 'redirect_url' argument
        return constructUrl("https://id.twitch.tv/oauth2/authorize?", args);
    }
    createOAuthWebview(targetUrl) {
        let config = this.#dependencies['config'];
        return webview.spawn({
            title : config.getAppConfig("APP_NAME"),
            width : config.getAppConfig("LOGIN_VIEW_SIZE.WIDTH"),
            height : config.getAppConfig("LOGIN_VIEW_SIZE.HEIGHT"),
            url : targetUrl
        });
    }

    getUserId() {
        let config = this.#dependencies['config'];
        let ss = this.#dependencies['session'];
        if (!ss.isAuthenticated()) {
            throw new Error("Cannot fetch user information before logging in.");
        }

        // https://dev.twitch.tv/docs/api/reference/#get-users
        return fetch(`${config.getAppConfig("TWITCH_API_HOST")}/users`, {
            method: "GET",
            headers: this.#getRequestHeaders(),
        }).then((response)=>{
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.json());
        });
    }
}


module.exports = twitchService;