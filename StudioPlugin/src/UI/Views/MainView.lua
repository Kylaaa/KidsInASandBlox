local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local RoactRodux = require(Libs.RoactRodux)

local UIFolder = plugin.UI
local Components = UI.Components
local EventsMarquee = require(Components.EventsMarquee)

local Views = UI.Views
local LoginView = require(Views.LoginView)
local SandboxView = require(Views.SandboxView)
local SettingsView = require(Views.SettingsView)


local MainView = Roact.PureComponent:extend(script.Name)

function MainView:render()
	local isAuthenticated = self.props.isAuthenticated

	return Roact.createFragment({
		LogInView = if isAuthenticated then Roact.createElement(LoginView) else nil,
		Marquee = Roact.createElement(EventsMarquee),
		SettingsView = Roact.createElement(SettingsView),
		SandboxView = Roact.createElement(SandboxView),
	})
end

return RoactRodux.connect(function(state, props)
	return {
		isAuthenticated = state.TwitchUser.isAuthenticated,
	}
end, function(dispatch)
	return {}
end)(MainView)