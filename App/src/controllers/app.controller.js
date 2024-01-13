const config = require('./../config/app.config.json');
const twitchOAuthWebview = require('./../utils/twitchOAuthWebview.js');
const createErrResponse = require('./../models/createErrorResponse.js');


class AppController {
	#dependencies = {};

	constructor(logsService, dbService, twitchService) {
		this.#dependencies['logs'] = logsService;
		this.#dependencies['db'] = dbService;
		this.#dependencies['twitch'] = twitchService;
	}

	async start() {
		const scopes = this.#dependencies['twitch'].getScopes();

		// launch the webview
		twitchOAuthWebview(scopes)
	};

	// Provide a simple endpoint that the Studio Plugin can hit to quickly verify that the server is running
	isAlive(request, response, next) {
		response.json({ isAlive : 'true' })
	};

	// The Studio plugin will likely connect and disconnect repeatedly, this endpoint will serve to tell the plugin whether any initialization needs to happen
	checkConnection(request, response, next) {
		const isConnected = twitchWSClient.checkIsConnectedToTwitch();
		response.json(JSON.stringify(isConnected));
	};

	
	// Should be called once when Studio tells the app it is ready
	connectToTwitch(request, response, next) {
		const isConnected = twitchWSClient.checkIsConnectedToTwitch();
		if (!isConnected) {
			twitchWSClient.startTwitchClient();
		};
		response.json({});
	};

	// Register a public callback for the login url
	authenticate(request, response, next) {
		// store the console auth token
		this.#dependencies['log'].trace(request);
	};
	requestLogin(request, response, next) {
		const scopes = {};
		this.#dependencies['log'].trace(request.body);
		this.#dependencies['log'].trace(typeof(request.body));
		//twitchOAuthWebview(scopes);
	};

	
	//add another event to subscribe to
	subscribe(request, response, next) {
		this.#dependencies['log'].trace(request.body);
		//twitchWSClient.subscribeToEvent(event, version);
		response.json({});
	};

	//remove a current event subscription
	unsubscribe(request, response, next) {
		this.#dependencies['log'].trace(request.body);

		//twitchWSClient.unsubscribeFromEvent(event);
		response.json({});
	};

	//return the messages that have come in since the last time they were requested
	async events(request, response, next) {
		let logger = this.#dependencies['logs'];

		let query = request.query;
		let start = query['start'];
		let end = query['end'];
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

module.exports = AppController;