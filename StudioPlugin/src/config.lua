return {
	-- plugin
	PLUGIN_NAME = "TwitchBlox",
	PLUGIN_VERSION = "0.0.1",
	PLUGIN_SIZE_X_MIN = 200, -- pixels
	PLUGIN_SIZE_Y_MIN = 200, -- pixels
	PLUGIN_SIZE_X_INIT = 400, -- pixels
	PLUGIN_SIZE_Y_INIT = 200, -- pixels

	-- networking
	HTTP_DEBUG = true,
	HTTP_PORT = "3000",
	HTTP_POLLING_INTERVAL = 1500, -- ms
	HTTP_POLLING_TIMEOUT = 2000, -- ms

	-- logging
	LOGGING_LEVEL = 0, -- none
	LOG_TO_OUTPUT = true,

	-- twitch events
	TWITCH_OBSERVED_EVENTS = {
		{
			name = "channel.follow",
			version = 1,
		},
		{
			name = "channel.subscribe",
			version = 1,
		},
		{
			name = "channel.subscriptin.gift",
			version = 1,
		},
		{
			name = "channel.subscription.message",
			version = 1,
		},
		{
			name = "channel.cheer",
			version = 1,
		},
		{
			name = "channel.raid",
			version = 1,
		},
		{
			name = "channel.hype_train.begin",
			version = 1,
		},
		{
			name = "channel.hype_train.progress",
			version = 1,
		},
		{
			name = "channel.hype_train.end",
			version = 1,
		},
	},
}