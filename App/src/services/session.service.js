// holds onto relevant session information that controllers can reference
class sessionService {
	#dependencies = {};

	authToken = null;
	sessionToken = null;
	expectedStateString = null;

	/* example userData as returned after logging in
	{
      "id": "141981764",
      "login": "twitchdev",
      "display_name": "TwitchDev",
      "type": "",
      "broadcaster_type": "partner",
      "description": "Supporting third-party developers building Twitch integrations from chatbots to game integrations.",
      "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/8a6381c7-d0c0-4576-b179-38bd5ce1d6af-profile_image-300x300.png",
      "offline_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/3f13ab61-ec78-4fe6-8481-8682cb3b0ac2-channel_offline_image-1920x1080.png",
      "view_count": 5980557,
      "email": "not-real@email.com",
      "created_at": "2016-12-14T20:32:28Z"
    }
	*/
	currentUserData = null;

	observedEvents = [];
	observedEventsRetry = [];

	constructor(logsService) {
		this.#dependencies['logs'] = logsService;
	}

	setAuthToken(stateString, token) {
        let ls = this.#dependencies['logs'];

        if (this.expectedStateString != stateString) {
            ls.error(`Attempted to set auth token with invalid state. Expected ${this.expectedStateString}, but received ${stateString}`);
            throw new Error("Attempted to set auth token with invalid state string.");
        }
        this.authToken = token;
        ls.trace("Auth token set successfully!");
    }

    isAuthenticated() {
    	return this.authToken != null;
    }
    isSocketConnected() {
    	return this.sessionToken != null;
    }
}


module.exports = sessionService;