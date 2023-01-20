local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local Http = require(Libs.Http)

local RunService = game:GetService("RunService")


local NetworkingManager = {}
NetworkingManager.__index = NetworkingManager

function NetworkingManager.new(dependencies : {})
	local cm = dependencies.ConfigurationManager

	local nm = {
		host = cm:getValue("HTTP_HOST"),
		port = cm:getValue("HTTP_PORT"),
		interval = cm:getValue("HTTP_POLLING_INTERVAL"),
		timeout = cm:getValue("HTTP_POLLING_TIMEOUT"),
		httpImpl = Http.new(),
		connections = {},
	}
	setmetatable(nm, NetworkingManager)

	return nm
end

function NetworkingManager:updateHost(newHost : string)
	self.host = newHost
end

function NetworkingManager:updatePort(newPort : string)
	self.port = newPort
end

function NetworkingManager:startPolling(path : string, onResponse : ({}) -> ())
	local targetUrl = string.format("%s:%s/%s", self.host, self.port, path)

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
		self.httpImpl:parseJson(requestPromise):andThen(function(responseJSON)
			print("Changes since last request : ", responseJSON)
			onResponse(responseJSON)
			requestDebounce = false
			timeSinceLastPoll = self.interval
		end, function(parseError)
			warn("failed to parse JSON with error : " .. parseError)
			requestDebounce = false
			timeSinceLastPoll = self.interval
		end)
	end))
end

function NetworkingManager:stopPolling()
	for _, connection in ipairs(connections) do
		connection:Disconnect()
	end
end

return NetworkingManager