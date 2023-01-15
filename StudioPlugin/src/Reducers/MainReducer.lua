local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Rodux = require(Libs.Rodux)

local ReducersFolder = plugin.Reducers

local MainReducer = Rodux.combineReducers({
	Characters = require(ReducersFolder.Characters),
	EventMarshaller = require(ReducersFolder.EventMarshaller),
})

return MainReducer