/*
	A web socket client to listen for messages from Twitch
*/

const signal = require('./signal.js');
const WebSocketClient = require('websocket').client;

class twitchWebsocketClient {
	onConnection = new signal('onConnection');
	onWelcome = new signal('onWelcome'); // <string id, string timestamp, Object payload>
	onKeepalive = new signal('onKeepalive');
	onReconnect = new signal('onReconnect');
	onRevocation = new signal('onRevocation');
	onMessage = new signal('onMessage'); // <string id, string timestamp, Object payload>
	onError = new signal('onError');
	onClose = new signal('onClose');

	#connection = null;
	#client = new WebSocketClient();
	#isConnected = false;
	#sessionId = null;
	#dependencies = {};

	constructor(configService, logService) {
		this.#dependencies['config'] = configService;
		this.#dependencies['logs'] = logService;

		this.#client.on('connect', (connection)=>{
			this.#connection = connection;
			this.#isConnected = true;
			this.onConnection.fire(connection);

			connection.on('error', (error)=>{
				this.onError.fire(error);
			});

			connection.on('close', ()=>{
				this.onClose.fire();
				this.#connection = null;
			});

			connection.on('message', (message)=>{
				let ls = this.#dependencies['logs'];

				let msgarr = ["Received message..."];
				for (let [key, val] of Object.entries(message)){
					msgarr.push(`${key} : ${val.toString()}`);
				}
				ls.trace(msgarr.join(`\n`));

				if (message.type === 'utf8'){
					let data = JSON.parse(message.utf8Data);
					let id = data.metadata.message_id;
					let timestamp = data.metadata.message_timestamp;
					let payload = data.payload;

					switch (data.metadata.message_type){
						// handle welcome message
						case "session_welcome":
							// example :
							/* 
								{
									"session":{
										"id":"AgoQeBPN61v1QvmcRvnd123ZIRIGY2VsbC1i",
										"status":"connected",
										"connected_at":"2024-02-29T17:05:44.603149329Z",
										"keepalive_timeout_seconds":10,
										"reconnect_url":null
									}
								}
							 */
							this.onWelcome.fire(id, timestamp, payload);
							break;

						case "session_keepalive":
							//ls.trace("received keepalive from Twitch");
							break;

						case "session_reconnect":
							// example :
							/*
								{
									"session": {
										"id": "AQoQexAWVYKSTIu4ec_2VAxyuhAB",
										"status": "reconnecting",
										"keepalive_timeout_seconds": null,
										"reconnect_url": "wss://eventsub.wss.twitch.tv?...",
										"connected_at": "2022-11-16T10:11:12.634234626Z"
									}
								}
							 */
							this.onReconnect.fire(id, timestamp, payload);
							break;
						case "revocation":
							// Twitch revokes your subscription in the following cases:
							//	- The user mentioned in the subscription no longer exists. The notification’s status field is set to user_removed.
							//	- The user revoked the authorization token that the subscription relied on. The notification’s status field is set to authorization_revoked.
							//	- The subscribed to subscription type and version is no longer supported. The notification’s status field is set to version_removed.

							// example :
							/*
								{
									"subscription": {
										"id": "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
										"status": "authorization_revoked",
										"type": "channel.follow",
										"version": "1",
										"cost": 1,
										"condition": {
											"broadcaster_user_id": "12826"
										},
										"transport": {
											"method": "websocket",
											"session_id": "AQoQexAWVYKSTIu4ec_2VAxyuhAB"
										},
										"created_at": "2022-11-16T10:11:12.464757833Z"
									}
								}
							 */
							this.onRevocation(id, timestamp, payload);
							break;

						default:
							let eventType = data.metadata.subscription_type;
							this.onMessage.fire(id, timestamp, eventType, payload);
							break;
					}
				}

				this.onMessage.fire(message);
			});
		});
	}

	get isConnected() {
		return (this.#connection === null) ? false : this.#connection.connected;
	}

	start() {
		let config = this.#dependencies['config'];
		let ls = this.#dependencies['logs'];
		 
		ls.trace("Starting WS Connection with Twitch...");
		if (this.#isConnected) {
			throw new Error("Already connected, cannot connect again!");
			return;
		}
		this.#client.connect(config.getAppConfig("TWITCH_WS_HOST"), config.getAppConfig("TWITCH_WS_PROTOCOL"));
	}
}

module.exports = twitchWebsocketClient;