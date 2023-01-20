local pluginRoot = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin
local ManagersFolder = pluginRoot.Managers
local SingletonManager = require(ManagersFolder.SingletonManager)


-- set up our dependency tree for all of our managers
local sm = SingletonManager.new()
sm:registerSingleton(ManagersFolder.ConfigurationManager, {})
sm:registerSingleton(ManagersFolder.LogManager, {
	ManagersFolder.ConfigurationManager,
})
sm:registerSingleton(ManagersFolder.NetworkingManager, {
	ManagersFolder.ConfigurationManager,
	ManagersFolder.LogManager,
})
sm:registerSingleton(ManagersFolder.NPCManager, {
	ManagersFolder.ConfigurationManager,
})
sm:registerSingleton(ManagersFolder.StateManager, {
	ManagersFolder.LogManager,
})
sm:registerSingleton(ManagersFolder.TwitchBloxManager, {
	ManagersFolder.ConfigurationManager,
	ManagersFolder.LogManager,
	ManagersFolder.NetworkingManager,
	ManagersFolder.NPCManager,
	ManagersFolder.StateManager,
})
sm:initialize()

sm:get("TwitchBloxManager"):start()

plugin.Unloading:Connect(function()
	sm:get("TwitchBloxManager"):cleanup()
end)