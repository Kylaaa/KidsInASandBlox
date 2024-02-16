const config = require('./../config/app.config.json');
const createErrResponse = require('./../models/createErrorResponse.js');
const path = require('node:path');

class AuthController {
	#dependencies = {};
	
	constructor(logsService, twitchService) {
		this.#dependencies['logs'] = logsService;
		this.#dependencies['twitch'] = twitchService;
	}

	getLoginConfiguration(request, response, next) {
		let ts = this.#dependencies['twitch'];

		response.json({
			eventData : ts.getTwitchEventData()
		});
	}

	
	// Should be called once when Studio tells the app it is ready
	connectToTwitch(request, response, next) {
		const isConnected = twitchWSClient.checkIsConnectedToTwitch();
		if (!isConnected) {
			twitchWSClient.startTwitchClient();
		};
		response.json({});
	};

	loginUI(request, response, next) {
		response.sendFile(path.resolve(__dirname, "../../public/login/index.html"));
	}

	// open a webview to allow the user to login
	login(request, response, next) {
		let logger = this.#dependencies['logs'];
		let ts = this.#dependencies['twitch'];

		let body = request.body;
		let scopes = body[`scopes`];

		let wv = ts.createOAuthWebview(scopes);
		response.status(202).json({
			success: true,
			message: "Please log in with Twitch now..."
		});
	};

	// Register a public callback for the login url
	authenticate(setTokenUrl, request, response, next) {
		let logger = this.#dependencies['logs'];

		let query = request.query;
		let scriptTag = "<script>window.close();</script>";
		if (query['error']) {
			let err = decodeURI(query['error']);
			let description = decodeURI(query['error_description']);
			logger.error(`Failed to authenticate the user with error : ${err}. ${description}`);
		}
		else {
			// the auth token is sent to the client in the fragment part of the URL
			// since that is inaccessible, send a script to the window to report the token
			logger.trace(`Having JS report the auth token to ${setTokenUrl}`);
			scriptTag = `<script>` +
				`try {` +
				`let hash = window.document.location.hash.substring(1);` +
				`var req = new XMLHttpRequest();` +
				`req.open("GET", "${setTokenUrl}?" + hash, true);` +
				`req.onreadystatechange = ()=>{` +
					`if (req.readyState === XMLHttpRequest.DONE) {` +
						`window.close();` +
					`}` +
				`};` +
				`req.send();` +
				`} catch(e) { alert(e); window.close(); }` +
				`</script>`;
		}

		// tell the OAuth window to close
		response.send(scriptTag);
	};

	// Create a follow up url that javascript can report the fragment
	setToken(request, response, next) {
		let ts = this.#dependencies['twitch'];

		let query = request.query;
		let stateString = query.state;
		let token = query.access_token;
		ts.setAuthToken(stateString, token);

		response.json({
			success: true,
			message: "Parsing token now!"
		});
	}
}

module.exports = AuthController;