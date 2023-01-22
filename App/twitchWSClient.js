/*
	A web socket client to listen for messages from Twitch
*/

const config = require('./config.json')

const http = require('http');
const WebSocketClient = require('websocket').client;
const createEvent = require('./event.js').createEvent;

const twitchObserver = new WebSocketClient();

const onMessage = createEvent('onMessage');
const onError = createEvent('onError'); 

var isConnected = false;
var events = []; // array of { eventName, version } objects

function unsubscribeFromEvent(eventName) {
	// hit the twitch API
}
function subscribeToEvent(eventName, version) {
	// hit the twitch API
}

module.exports = {
	client : twitchObserver,

	// public signals
	onMessage : onMessage,
	onError : onError,

    // public functions
	checkIsConnectedToTwitch : ()=>{
		return isConnected;
	},

	subscribeToEvent : (event, version)=> {
		console.log("Twitch connecting to event " + event);
		if (isConnected) {
			subscribeToEvent(event, version);
		} else {
			events.push({ "event" : event, "version" : version });
		}
	},

	unsubscribeFromEvent : (event)=> {
		console.log("Twitch unsubscribing from event " + event);
		if (isConnected) {
			unsubscribeFromEvent(event);
		} else {
			var index = events.findIndex(element => {
				element.name == event;
			});
			if (index != -1) {
				events.splice(index, 1);
			}
		}
	},

	startTwitchClient : () => {
		const host = "wss://eventsub-beta.wss.twitch.tv/ws";

		twitchObserver.on('connect', function(connection){
			console.log('Twitch WS connected...')
			isConnected = true;
			events.foreach(eventData => {
				console.log("-Twitch client subscribing to event..." + eventData.name);
				subscribeToEvent(eventData.name, eventData.version);
			});

			connection.on('error', function(error){
				console.log("Twitch connection threw an error", error);
				onError.fire(error);
			});

			connection.on('close', function(){
				console.log("Twitch connection closed");
				isConnected = false;
			});

			connection.on('message', function(message){
				console.log("Twitch connection sent a message", message);
				onMessage.fire(message);
			})
		});
		twitchObserver.connect(host, 'echo-protocol')
	}
}