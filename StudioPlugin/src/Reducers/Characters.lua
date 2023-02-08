local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local Libs = plugin.Libs
local Rodux = require(Libs.Rodux)

--[[
	Holds onto the characters currently in the sandbox
]]
local Characters = Rodux.createReducer({}, {
	
})

return Characters