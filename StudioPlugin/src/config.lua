return {
	-- plugin
	PLUGIN_NAME = "TwitchBlox",
	PLUGIN_VERSION = "0.0.1",
	PLUGIN_SIZE_X_MIN = 200, -- pixels
	PLUGIN_SIZE_Y_MIN = 200, -- pixels
	PLUGIN_SIZE_X_INIT = 400, -- pixels
	PLUGIN_SIZE_Y_INIT = 200, -- pixels

	-- networking
	HTTP_DEBUG = false,
	HTTP_HOST = "localhost",
	HTTP_PORT = "3000",
	HTTP_PATH = "changes",
	HTTP_POLLING_INTERVAL = 1500, -- ms
	HTTP_POLLING_TIMEOUT = 2000, -- ms

	-- logging
	LOGGING_LEVEL = 0, -- none
	LOG_TO_OUTPUT = true,
}