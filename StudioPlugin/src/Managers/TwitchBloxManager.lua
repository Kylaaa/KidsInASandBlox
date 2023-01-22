local plugin = script:FindFirstAncestorOfClass("Plugin")
local pluginRoot = plugin.TwitchBloxPlugin

local LibsFolder = pluginRoot.Libs
local Roact = require(LibsFolder.Roact)

local UIFolder = pluginRoot.UI
local MainUI = require(UIFolder.MainUI)

local UtilFolder = pluginRoot.Util
local getSubscribedTwitchEvents = require(UtilFolder.getSubscribedTwitchEvents)


local TwitchBloxManager = {}
TwitchBloxManager.__index = TwitchBloxManager

function TwitchBloxManager.new(dependencies : {})
	local tbm = {
		dependencies = dependencies,
	}
	setmetatable(tbm, TwitchBloxManager)

	return tbm
end


--[[ helper functions]]
function TwitchBloxManager:initializeStateFromSettings()
	-- load the stored persistent data, use that to initialize the plugin
	local pm = self.dependencies.PersistenceManager
	pm:loadTwitchEvents()
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
	pluginGui:BindToClose(function()
		pluginGui.Enabled = false
	end)
	local app = Roact.createElement(MainUI) 
	Roact.mount(app, pluginGui)
end



--[[ The plugin has been initialized ]]
function TwitchBloxManager:start()
	self:initializeStateFromSettings()
	self:createPluginToolbar()
end

--[[ The plugin has been enabled and the dockwidget is visible ]]
function TwitchBloxManager:enable()
	local nm = self.dependencies.NetworkingManager
	local cm = self.dependencies.ConfigurationManager
	local function beginPolling()
		nm:startPollingForChanges(function(changes)
			print("Changes since last request : ", changes)
		end)
	end

	nm:checkIfConnectedToTwitch(function(isConnected, message)
		if isConnected then
			beginPolling()	
		else
			local events = getSubscribedTwitchEvents()
			nm:subscribeToEvents(events, function(success, message)

				nm:connectToTwitch(function()
				end);
			end);
			
		end
	end)
	
end

--[[ The plugin has simply been closed and the dockwidget is no longer visible ]]
function TwitchBloxManager:disable()
	local nm = self.dependencies.NetworkingManager
	nm:stopPolling()
end

--[[ The plugin is being uninstalled, or the datamodel is closing ]]
function TwitchBloxManager:cleanUp()
	local nm = self.dependencies.NetworkingManager
	nm:stopPolling()
end

return TwitchBloxManager