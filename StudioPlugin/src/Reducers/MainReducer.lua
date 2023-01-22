local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Rodux = require(Libs.Rodux)

local ReducersFolder = plugin.Reducers

local MainReducer = Rodux.combineReducers({
	Characters = require(ReducersFolder.Characters),
	Messages = require(ReducersFolder.Messages),
	TwitchEvents = require(ReducersFolder.TwitchEvents),
})

return MainReducer