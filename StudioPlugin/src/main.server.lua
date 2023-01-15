local pluginRoot = script.Parent

local LibsFolder = pluginRoot.Libs
local Roact = require(LibsFolder.Roact)

local UIFolder = pluginRoot.UI
local MainUI = require(UIFolder.MainUI)

local ManagersFolder = pluginRoot.ManagersFolder
local SingletonManager = require(ManagersFolder.SingletonManager)


plugin.Name = "TwitchBlox"

-- set up our dependency tree for all of our managers
local sm = SingletonManager.new()
sm:registerSingleton(ManagersFolder.NetworkingManager, {})
sm:initialize()

self.info = DockWidgetPluginGuiInfo.new(
	Enum.InitialDockState.Float,
	false, -- Enabled
	true, -- disregardPreviousState
	300, -- X
	200, -- Y
	100, -- minX
	100 -- minY
)
local pluginGui = plugin:CreateDockWidgetPluginGui(plugin.Name, info)
local toolbar = plugin:CreateToolbar(plugin.Name)
local toggleButton = toolbar:CreateButton("Show Sandbox", "Toggle the widget", "")
toggleButton.Click:Connect(function()
	pluginGui.Enabled = not pluginGui.Enabled
end)
gui:BindToClose(function()
	pluginGui.Enabled = false
end)
local root = Roact.mount(MainUI, pluginGui)


plugin.Unloading:Connect(function()
	sm:get("NetworkingManager"):stopPolling()
	root:unmount()
end)