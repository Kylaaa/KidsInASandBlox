local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Rodux = require(Libs.Rodux)

local EventMarshaller = Rodux.createReducer({}, {
	
})

return EventMarshaller