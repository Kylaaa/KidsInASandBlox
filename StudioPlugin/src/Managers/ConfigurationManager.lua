local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local config = require(plugin.config)


local ConfigurationManager = {}
ConfigurationManager.__index = ConfigurationManager

function ConfigurationManager.new(dependencies : {})
	local cm = {}
	for k, v in pairs(config) do
		cm[k] = v
	end
	setmetatable(cm, ConfigurationManager)

	return cm
end

function ConfigurationManager:getValue(key : string)
	if not self[key] then
		error(string.format("No value loaded for key, %s", key), 1)
		return nil
	end

	return self[key]
end

function ConfigurationManager:setValue(key : string, value : any)
	if not self[key] then
		error(string.format("Could not set value for key, %s", key), 1)
		return
	end

	self[key] = value
end

return ConfigurationManager