local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Rodux = require(Libs.Rodux)
local Cryo = require(Libs.Cryo)

local ActionsFolder = plugin.Actions
local LoggedMessage = require(ActionsFolder.LoggedMessage)

local ManagersFolder = plugin.Managers
local SingletonManager = require(ManagersFolder.SingletonManager)

local EventsFolder = pluginroot.Events
local UpdateSettingEvent = EventsFolder.UpdateSetting

--[[
	Holds onto settings about the TwitchUser
]]
local TwitchUser = Rodux.createReducer({
	channelName = "",
	broadcasterId = 0,
	isAuthenticated = false,
	events = {},
}, {
	[SetChannelName.Name] = function(state, action)
		local channelName = action.channelName

		UpdateSettingEvent:Fire("User", "Channel", channelName)

		return Cryo.Dictionary.join(state, {
			channelName = channelName,
		})
	end,

	[SetBroadcasterId.Name] = function(state, action)
		local broadcasterId = action.broadcasterId

		UpdateSettingEvent:Fire("User", "BroadcasterId", broadcasterId)

		return Cryo.Dictionary.join(state, {
			broadcasterId = broadcasterId,
		})
	end,

	[SetUserAuthenticated.Name] = function(state, action)
		local isAuthenticated = action.isAuthenticated

		UpdateSettingEvent:Fire("User", "isAuthenticated", isAuthenticated)

		return Cryo.Dictionary.join(state, {
			isAuthenticated = isAuthenticated,
		})
	end,

	[LoadObservedEvent.Name] = function(state, action)
		local eventData = action.eventData
		local eventName = eventData.name

		return Cryo.Dictionary.join(state, {
			events = Cryo.Dictionary.join(state.events, {
				[eventName] = eventData,
			}),
		})
	end,

	[ToggleObservedEvent.Name] = function(state, action)
		local eventName = action.eventName
		local eventData = Cryo.Dictionary.join(state[eventName], {
			enabled = not state[eventName].enabled,
		})
		
		UpdateSettingEvent:Fire("ObservedEvents", eventName, eventData)

		return Cryo.Dictionary.join(state, {
			events = Cryo.Dictionary.join(state.events, {
				[eventName] = eventData,
			}),
		})
	end,
})

return TwitchUser