local plugin = script:FindFirstAncestorOfClass("Plugin")
local pluginRoot = plugin.TwitchBloxPlugin

local ManagersFolder = pluginRoot.Managers
local SingletonManager = require(ManagersFolder.SingletonManager)

return function(action : {})
	local sm = SingletonManager.getInstance():get("StateManager")
	return sm.storeRef:dispatch(action)
end