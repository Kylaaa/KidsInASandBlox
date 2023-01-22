--[[
	Handles just the interface for accessing and modifying persistent data 
--]]

local plugin = script:FindFirstAncestorOfClass("Plugin")
local pluginRoot = plugin.TwitchBloxPlugin

local ActionsFolder = pluginRoot.Actions
local LoadObservedEvent = require(ActionsFolder.LoadObservedEvent)


local PersistenceManager = {}
PersistenceManager.__index = PersistenceManager

function PersistenceManager.new(dependencies)
	local dm = {
		dependencies = dependencies,
		connections = {},
	}
	setmetatable(dm, PersistenceManager)
	
	return dm
end

function PersistenceManager:loadSettings(settingsToCheck : {}) : ({})
	local settings = {}
	for key, defaultValue in pairs(settingsToCheck) do
		local existingValue = plugin:GetSetting(key)
		if existingValue then
			settings[key] = existingValue
		else
			plugin:SetSetting(key, defaultValue)
			settings[key] = defaultValue
		end
		print("Loaded Setting : ", key, settings[key])
	end

	return settings
end

function PersistenceManager:saveSettings(settingsToSave : {})
	for key, value in pairs(settingsToSave) do
		plugin:SetSetting(key, value)
	end
end

function PersistenceManager:loadTwitchEvents()
	local cm = self.dependencies.ConfigurationManager
	local sm = self.dependencies.StateManager

	local events = cm:getValue("TWITCH_OBSERVED_EVENTS")
	local settings = {}
	for _, eventData in ipairs(events) do
		local settingName = string.format("ObservedEvents|%s|%d", eventData.name, eventData.version)
		local defaultValue = true
		settings[settingName] = defaultValue
	end

	local persistedValues = self:loadSettings(settings)
	local storeRef = sm.storeRef
	for settingName, value in pairs(persistedValues) do
		local parts = {}
		string.gsub(settingName, "([^|]+)", function(part) table.insert(parts, part) end) -- splits the settingName on the '|' character
		local eventName = parts[2]
		local eventVersion = tonumber(parts[3])
		local action = LoadObservedEvent(eventName, eventVersion, value)
		storeRef:dispatch(action)
	end
end


return PersistenceManager