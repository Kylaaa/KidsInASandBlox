local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Rodux = require(Libs.Rodux)
local Cryo = require(Libs.Cryo)

local ActionsFolder = plugin.Actions
local LoadObservedEvent = require(ActionsFolder.LoadObservedEvent)
local ToggleObservedEvent = require(ActionsFolder.ToggleObservedEvent)

--[[
	Keep track of all of the events being subscribed to
]]
local TwitchEvents = Rodux.createReducer({}, {
	[LoadObservedEvent.Name] = function(state, action)
		return Cryo.Dictionary.join(state, {
			[action.eventName] = {
				enabled = action.isOn,
				version = action.eventVersion,
			},
		})
	end,

	[ToggleObservedEvent.Name] = function(state, action)
		local currentValue = state[action.eventName].enabled
		assert(currentValue ~= nil)

		return Cryo.Dictionary.join(state, {
			[action.eventName] = Cryo.Dictionary.join(state[action.eventName], {
				enabled = not currentValue,
			}),
		})
	end,
})

return TwitchEvents