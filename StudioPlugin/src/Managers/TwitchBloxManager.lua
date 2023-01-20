local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local LibsFolder = plugin.Libs
local Roact = require(LibsFolder.Roact)

local UIFolder = plugin.UI
local MainUI = require(UIFolder.MainUI)


local TwitchBloxManager = {}
TwitchBloxManager.__index = TwitchBloxManager

function TwitchBloxManager.new(dependencies : {})
	local tbm = {
		dependencies = dependencies,
	}
	setmetatable(tbm, TwitchBloxManager)

	return tbm
end

function TwitchBloxManager:createPluginToolbar()
	local cm = self.dependencies.ConfigurationManager
	local nm = self.dependencies.NetworkingManager

	local info = DockWidgetPluginGuiInfo.new(
		Enum.InitialDockState.Float,
		false, -- Enabled
		true, -- disregardPreviousState
		cm:getValue("PLUGIN_SIZE_X_INIT"), -- X
		cm:getValue("PLUGIN_SIZE_Y_INIT"), -- Y
		cm:getValue("PLUGIN_SIZE_X_MIN"), -- minX
		cm:getValue("PLUGIN_SIZE_Y_MIN") -- minY
	)

	local widgetTitle = string.format("%s ver. %s", cm:getValue("PLUGIN_NAME"), cm:getValue("PLUGIN_VERSION"))
	local pluginGui = plugin:CreateDockWidgetPluginGui(widgetTitle, info)
	local toolbar = plugin:CreateToolbar(cm:getValue("PLUGIN_NAME"))
	local toggleButton = toolbar:CreateButton("Show Sandbox", "Toggle the widget", "")
	toggleButton.Click:Connect(function()
		pluginGui.Enabled = not pluginGui.Enabled

		if pluginGui.Enabled then
			self:enable()
		else
			self:disable()
		end
	end)
	gui:BindToClose(function()
		pluginGui.Enabled = false
	end)
	Roact.mount(MainUI, pluginGui)
end

function TwitchBloxManager:start()
	self:createPluginToolbar()
end

function TwitchBloxManager:enable()
	local nm = self.dependencies.NetworkingManager
	nm:startPolling("", function(changes)

	end)
end

function TwitchBloxManager:disable()
	local nm = self.dependencies.NetworkingManager
	nm:stopPolling()
end

function TwitchBloxManager:cleanUp()
	local nm = self.dependencies.NetworkingManager
	nm:stopPolling()
end

return TwitchBloxManager