/*
 *
 */
const config = require('./../config/app.config.json')
const twitchOAuthWebview = require('./../utils/twitchOAuthWebview.js')


function createAppController(eventsService, twitchService){
	async function start(){
		const wv = twitchOAuthWebview()
	};

	// Provide a simple endpoint that the Studio Plugin can hit to quickly verify that the server is running
	function isAlive(request, response, next) {
		response.json(JSON.stringify("{ 'isAlive' = 'true' }"))
	};

	// The Studio plugin will likely connect and disconnect repeatedly, this endpoint will serve to tell the plugin whether any initialization needs to happen
	function checkConnection(request, response, next) {
		const isConnected = twitchWSClient.checkIsConnectedToTwitch();
		response.json(JSON.stringify(isConnected));
	};

	
	// Should be called once when Studio tells the app it is ready
	function connectToTwitch(request, response, next) {
		const isConnected = twitchWSClient.checkIsConnectedToTwitch();
		if (!isConnected) {
			twitchWSClient.startTwitchClient();
		};
		response.json({});
	};

	// Register a public callback for the login url
	function authenticate(request, response, next) {
		// store the console auth token
		console.log(request);
	};
	function requestLogin(request, response, next) {
		const scopes = {};
		console.log(request.body);
		console.log(typeof(request.body));
		//twitchOAuthWebview(scopes);
	};

	
	//add another event to subscribe to
	function subscribe(request, response, next) {
		console.log(request.body);
		//twitchWSClient.subscribeToEvent(event, version);
		response.json({});
	};

	//remove a current event subscription
	function unsubscribe(request, response, next) {
		console.log(request.body);

		//twitchWSClient.unsubscribeFromEvent(event);
		response.json({});
	};

	//return the messages that have come in since the last time they were requested
	function changes(request, response, next) {
		response.json(messages);

		// clear out the message queue
		messages = {};
	};

	return {
		start = start,
		isAlive = isAlive,
		checkConnection = checkConnection,
		connectToTwitch = connectToTwitch,
		subscribe = subscribe,
		unsubscribe = unsubscribe,
		changes = changes,
	};
}

module.exports = createAppController;