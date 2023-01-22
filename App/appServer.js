/*
	Create an local server for communicating with Roblox Studio.
*/

const config = require('./config.json')
const express = require('express');
const twitchWSClient = require('./twitchWSClient.js')


var messages = {};

const app = express();
app.use(express.json());
app.use(express.urlencoded());

twitchWSClient.onMessage.connect(function(message){
	console.log("New message from twitch!", message);
	messages.push(message);
});

/*
	The Studio plugin will likely connect and disconnect repeatedly, this endpoint will serve to tell the plugin whether any initialization needs to happen
*/
app.get("/checkConnection", function(request, response, next){
	const isConnected = twitchWSClient.checkIsConnectedToTwitch();
	response.json(JSON.stringify(isConnected));
})

/*
	Should be called once when Studio tells the app it is ready
*/
app.post("/connectToTwitch", function(request, response, next){
	const isConnected = twitchWSClient.checkIsConnectedToTwitch();
	if (!isConnected) {
		twitchWSClient.startTwitchClient();
	};
	response.json({});
});

/*
	add another event to subscribe to
*/
app.post("/subscribe", function(request, response, next){
	console.log(request.body);
	//twitchWSClient.subscribeToEvent(event, version);
	response.json({});
});

/*
	remove a current event subscription
*/
app.post("/unsubscribe", function(request, response, next){
	console.log(request.body);

	//twitchWSClient.unsubscribeFromEvent(event);
	response.json({});
});

/*
	return the messages that have come in since the last time they were requested
*/
app.get("/changes", function(request, response, next){
	response.json(messages);

	// clear out the message queue
	messages = {};
});




module.exports = {
	startAppServer : ()=> {
		const port = config.PUBLIC_PORT
		app.listen(port, function(){
			console.log(`${new Date()} KidsInASandBlox is listening on port ${port}`);
		});
	},
}