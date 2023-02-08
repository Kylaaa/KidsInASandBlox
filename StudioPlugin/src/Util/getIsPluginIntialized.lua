local plugin = script:FindFirstAncestorOfClass("Plugin")
local pluginRoot = plugin.TwitchBloxPlugin
local UtilFolder = pluginRoot.Util
local getCurrentState = require(UtilFolder.getCurrentState)

return function()
	local state = getCurrentState()
	return state.PluginData.isInitialized
end