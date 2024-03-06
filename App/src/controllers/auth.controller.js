const config = require('./../config/app.config.json');
const createErrResponse = require('./../models/createErrorResponse.js');
const path = require('node:path');

class AuthController {
	#dependencies = {};
	
	constructor(logsService, sessionService, twitchService) {
		this.#dependencies['logs'] = logsService;
		this.#dependencies['session'] = sessionService;
		this.#dependencies['twitch'] = twitchService;
	}

	getAuthConfig(request, response, next) {
		let ss = this.#dependencies['session'];
		let ts = this.#dependencies['twitch'];

		response.json({
			isAuthenticated : ss.isAuthenticated(),
			eventData : ts.getTwitchEventDataByScope()
		});
	}

	loginUI(request, response, next) {
		response.sendFile(path.resolve(__dirname, "../../public/login/index.html"));
	}

	processLogin(request, response, next) {
		response.sendFile(path.resolve(__dirname, "../../public/authenticate/index.html"));
	}

	login(request, response, next) {
		let logger = this.#dependencies['logs'];
		let ss = this.#dependencies['session'];
		let ts = this.#dependencies['twitch'];

		let body = request.body;
		if (Object.keys(body).length == 0) {
			response.status(400).json({
				success : false,
				message : "Please select at least 1 event to follow."
			});
			return;
		}

		let scopes = {};
		for (let [event, scope] of Object.entries(body)) {
			if (scopes[scope] === undefined) {
				scopes[scope] = true;
			}
		}
		if (scopes[""]) {
			delete scopes[""];
		}

		// hold onto these events until we log in...
		ss.observedEvents = Object.keys(body);

		let url = ts.createOAuthLoginUrl(Object.keys(scopes));
		response.redirect(url);
	};

	setToken(request, response, next) {
		let ls = this.#dependencies['logs'];
		let ss = this.#dependencies['session'];

		// parse the auth token from the query params
		let query = request.query;
		let stateString = query.state;
		let token = query.access_token;
		if (stateString === undefined || token === undefined) {
			response.status(400).json(createErrResponse("Missing state or access_token"));
			return;
		}

		try {
			ss.setAuthToken(stateString, token);
		} catch(e) {
			response.status(400).json(createErrResponse(e.message));
			return;
		}

		response.json({
			success : true,
			message : "Successfully set the authentication token"
		});
	}

	async fetchUserData(request, response, next) {
		let ls = this.#dependencies['logs'];
		let ts = this.#dependencies['twitch'];
		let ss = this.#dependencies['session'];
		try {
			await ts.getUserId().then(
				(userData)=>{
					ss.userData = userData;

					response.json({
						success : true,
						message : "Successfully loaded current user data",
						info : userData
					});
				},
				(err)=>{
					ls.error(`Failed to get userId with message ${err.toString()}`)
					response.status(500).json(createErrResponse(err.message));
				}
			);
		}
		catch(err) {
			response.status(401).json(createErrResponse(err.message));
		}
	};
}

module.exports = AuthController;