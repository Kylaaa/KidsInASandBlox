local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local Http = require(Libs.Http)

local HttpService = game:GetService("HttpService")
local RunService = game:GetService("RunService")


local NetworkingManager = {}
NetworkingManager.__index = NetworkingManager

function NetworkingManager.new(dependencies : {})
	local cm = dependencies.ConfigurationManager

	local nm = {
		host = "localhost",
		port = cm:getValue("HTTP_PORT"),
		interval = cm:getValue("HTTP_POLLING_INTERVAL"),
		timeout = cm:getValue("HTTP_POLLING_TIMEOUT"),
		httpImpl = Http.new({
			DEBUG = cm:getValue("HTTP_DEBUG"),
		}),
		connections = {},
	}
	setmetatable(nm, NetworkingManager)

	return nm
end


--[[
	Due to the nature of the Edit / Play datamodel lifecycle, it's important to check if the local server has connected to Twitch yet.
]]
function NetworkingManager:checkIfConnectedToTwitch(onResponse : (bool, string)->())
	local targetUrl = string.format("http://%s:%s/checkConnection", self.host, self.port)
	local fetchPromise = self.httpImpl:GET(targetUrl)
	self.httpImpl:parseJSON(fetchPromise):andThen(function(responseJSON)
		-- check if we are actually connected
		local isConnected = responseJSON.Body == "true"
		onResponse(isConnected, "")
	end, function(errorMessage)
		onResponse(false, "Failed to connect with message : " .. (errorMessage or ""))
	end)
end

--[[
	The local server will not connect to Twitch until Studio signals that it is ready.
]]
function NetworkingManager:connectToTwitch(onResponse : (bool, string)->())
	local targetUrl = string.format("http://%s:%s/connectToTwitch", self.host, self.port)
	local fetchPromise = self.httpImpl:POST(targetUrl, ""):andThen(function()
		onResponse(true, "")
	end)
end

--[[

]]
function NetworkingManager:subscribeToEvents(topics : {}, onResponse : (bool)->())
	local targetUrl = string.format("http://%s:%s/subscribe", self.host, self.port)
	local body = HttpService:JSONEncode(topics)
	self.httpImpl:POST(targetUrl, body):andThen(function()
		onResponse(true)
	end, function()
		onResponse(false)
	end)
end

function NetworkingManager:unsubscribeFromTopics(topics : {}, onResponse : ()->())
	local targetUrl = string.format("http://%s:%s/unsubscribe", self.host, self.port)
end

function NetworkingManager:startPollingForChanges(onResponse : ({}) -> ())
	local targetUrl = string.format("http://%s:%s/changes", self.host, self.port)

	-- don't dispatch a new request until the old one finishes
	local requestDebounce = false
	local timeSinceLastPoll = self.interval

	table.insert(self.connections, RunService.Heartbeat:Connect(function(deltaTimeS)
		if requestDebounce then
			return
		end

		timeSinceLastPoll -= (deltaTimeS * 1000)
		if timeSinceLastPoll > 0 then
			return
		end

		requestDebounce = true
		local requestPromise = self.httpImpl:GET(targetUrl)
		self.httpImpl:parseJSON(requestPromise):andThen(function(responseJSON)
			print("Changes since last request : ", responseJSON.Body)
			onResponse(responseJSON.Body)
			requestDebounce = false
			timeSinceLastPoll = self.interval
		end, function(parseError)
			warn("failed to parse JSON with error : " .. (parseError or ""))
			requestDebounce = false
			timeSinceLastPoll = self.interval
		end)
	end))
end

function NetworkingManager:stopPolling()
	for _, connection in ipairs(self.connections) do
		connection:Disconnect()
	end
end

return NetworkingManager