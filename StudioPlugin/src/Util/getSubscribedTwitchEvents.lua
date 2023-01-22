local plugin = script:FindFirstAncestorOfClass("Plugin")
local pluginRoot = plugin.TwitchBloxPlugin

local ManagersFolder = pluginRoot.Managers
local SingletonManager = require(ManagersFolder.SingletonManager)

return function()
	local sm = SingletonManager.getInstance():get("StateManager")
	local storeRef = sm.storeRef
	local TwitchEvents = storeRef:getState().TwitchEvents

	local subscriptions = {}
	for name, eventData in pairs(TwitchEvents) do
		if eventData.enabled == true then
			subscriptions[name] = eventData.version
		end
	end

	return subscriptions
end