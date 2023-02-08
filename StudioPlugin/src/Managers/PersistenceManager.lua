--[[
	Handles just the interface for accessing and modifying persistent data 
--]]

local plugin = script:FindFirstAncestorOfClass("Plugin")
local pluginRoot = plugin.TwitchBloxPlugin

local HttpService = game:GetService("HttpService")

local ActionsFolder = pluginRoot.Actions
local LoadObservedEvent = require(ActionsFolder.LoadObservedEvent)

local EventsFolder = pluginroot.Events
local UpdateSettingEvent = EventsFolder.UpdateSetting


local PersistenceManager = {}
PersistenceManager.__index = PersistenceManager

function PersistenceManager.new(dependencies)
	local dm = {
		dependencies = dependencies,
		connections = {},
	}
	setmetatable(dm, PersistenceManager)
	
	table.insert(connections, UpdateSettingEvent.Event:Connect(function(namespace, key, value)
		local settingName = self:constructSettingKey(namespace, key)
		plugin:SetSetting(settingName, value)
	end))

	return dm
end

-- Accessors and Mutators
function PersistenceManager:loadSetting(key) : any?
	return plugin:GetSetting(key, value)
end
function PersistenceManager:loadSettings(settingsToCheck : {}, overrideSettings : boolean) : ({})
	local settings = {}
	for key, defaultValue in pairs(settingsToCheck) do
		local existingValue = if not overrideSettings then plugin:GetSetting(key) else nil
		if existingValue then
			settings[key] = existingValue
		else
			plugin:SetSetting(key, defaultValue)
			settings[key] = defaultValue
		end
	end

	return settings
end

function PersistenceManager:saveSetting(key : string, value : any)
	plugin:SetSetting(key, value)
end
function PersistenceManager:saveSettings(settingsToSave : {})
	for key, value in pairs(settingsToSave) do
		plugin:SetSetting(key, value)
	end
end

-- Key Constructors
function PersistenceManager:constructSettingKey(namespace : string, key : string) : string
	local cm = self.dependencies.ConfigurationManager
	local version = cm:getValue("PLUGIN_VERSION")
	local settingName = string.format("%s|%s|%s", namespace, key, version)
	return settingName
end
function PersistenceManager:getPreviousStateKey()
	return self:constructSettingKey("State", "PreviousSession")
end
function PersistenceManager:getObservedEventKey(eventName : string)
	return self:constructSettingKey("ObservedEvents", eventName)
end
-- Helper Functions
--[[function PersistenceManager:loadTwitchEvents()
	local cm = self.dependencies.ConfigurationManager
	local sm = self.dependencies.StateManager

	local events = cm:getValue("TWITCH_OBSERVED_EVENTS")
	local overrideSettings = cm:getValue("DEBUG_OVERRIDE_SETTINGS")
	local version = cm:getValue("PLUGIN_VERSION")
	local settings = {}
	for _, eventData in ipairs(events) do
		-- PluginVersion is used as part of the key so that updates to the plugin will reset the settings
		local settingName = self:constructSettingKey("ObservedEvents", eventData.name)
		local defaultValue = {
			name = eventData.name,
			version = eventData.version,
			scope = eventData.scope,
			condition = eventData.condition,
			shouldObserve = true,
		}
		settings[settingName] = defaultValue
	end

	local persistedValues = self:loadSettings(settings)
	local storeRef = sm.storeRef
	for settingName, eventData in pairs(persistedValues) do
		local action = LoadObservedEvent(eventData)
		storeRef:dispatch(action)
	end

	local function isChanged(key, newState, oldState) : boolean
		return newState.TwitchUser[key] ~= oldState.TwitchUser[key]
	end
	local connection = storeRef.Changed:Connect(function(newState, oldState)
		if newState.TwitchUser ~= oldState.TwitchUser then
			if isChanged()
		end
	end)
	table.insert(self.connections, connection)
end]]


return PersistenceManager