local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local Http = require(Libs.Http)

local RunService = game:GetService("RunService")


local NetworkingManager = {}
NetworkingManager.__index = NetworkingManager

function NetworkingManager.new(dependencies : {})
	local nm = {
		host = "localhost",
		port = "8080",
		interval = 1000, --ms
		timeout = 2000, --ms
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

function NetworkingManager:beginPolling(path : string, onResponse : ({}) -> ())
	local targetUrl = string.format("%s:%s/%s", self.host, self.port, path)
	table.insert(self.connections, RunService.Heartbeat:Connect(function(deltaTime)
		local requestPromise = self.httpImpl:GET(targetUrl)
		self.httpImpl:parseJson(requestPromise):andThen(function(responseJSON)
			print("Changes since last request : ", responseJSON)
			onResponse(responseJSON)
		end)
	end))
end

function NetworkingManager:stopPolling()
	for _, connection in ipairs(connections) do
		connection:Disconnect()
	end
end

return NetworkingManager