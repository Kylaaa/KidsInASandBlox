/*
	A web socket client to listen for messages from Twitch
*/

const config = require('./../config/app.config.json')
const signal = require('./signal.js');
const WebSocketClient = require('websocket').client;

class twitchWebsocketClient {	
	onConnection = new signal('onConnection');
	onMessage = new signal('onMessage');
	onError = new signal('onError');
	onClose = new signal('onClose');

	#connection = null;
	#client = new WebSocketClient();
	#isConnected = false;

	constructor() {
		this.#client.on('connect', function(connection){
			this.#connection = connection;
			this.#isConnected = true;
			this.onConnection.fire(connection);

			connection.on('error', function(error){
				this.onError.fire(error);
			});

			connection.on('close', function(){
				this.onClose.fire();
				this.#connection = null;
			});

			connection.on('message', function(message){
				onMessage.fire(message);
			});
		});
	}

	get isConnected() {
		return (this.#connection === null) ? false : this.#connection.connected;
	}

	start() {
		if (this.#isConnected) {
			throw new Error("Already connected, cannot connect again!");
			return;
		}
		this.#client.connect(config.TWITCH_WS_HOST, config.TWITCH_WS_PROTOCOL);
	}
}

module.exports = twitchWebsocketClient;