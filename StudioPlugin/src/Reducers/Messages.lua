local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Rodux = require(Libs.Rodux)
local Cryo = require(Libs.Cryo)

local ActionsFolder = plugin.Actions
local LoggedMessage = require(ActionsFolder.LoggedMessage)

--[[
	Just a big running list of messages
]]
local Messages = Rodux.createReducer({}, {
	[LoggedMessage.Name] = function(state, action)
		local newMessage = {
			level = action.level,
			message = action.message,
		}
		-- put the new message at the head of the list
		return Cryo.List.join({ newMessage }, state)
	end,
})

return Messages