local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local RoactRodux = require(Libs.RoactRodux)

local ActionsFolder = plugin.Actions
local SetChannelName = require(ActionsFolder.SetChannelName)

local UIFolder = plugin.UI
local AtomsFolder = UIFolder.Atoms
local Frame = require(Atoms.Frame)
local TextLabel = require(Atoms.TextLabel)
local TextButton = require(Atoms.TextButton)
local TextBox = require(Atoms.TextBox)
local UIListLayout = require(Atoms.UIListLayout)

local ManagersFolder = plugin.Managers
local SingletonManager = require(ManagersFolder.SingletonManager)


local LoginView = Roact.PureComponent:extend(script.Name)

function LoginView:init()
	self.inputRef = Roact.createRef()

	self.onSubmit = function()
		local textbox = self.inputRef.current
		local dispatchSetChannelName = self.props.dispatchSetChannelName

		dispatchSetChannelName(textbox.Text)

		SingletonManager.getInstance():get("NetworkingManager")
	end
end

function LoginView:render()
	return Roact.createElement(Frame, {}, {
		Layout = Roact.createElement(UIListLayout),
		Title = Roact.createElement(TextLabel, {
			Text = "What is your channel name?",
			LayoutOrder = 1,
		}),
		Prompt = Roact.createElement(Frame, {
			Size = UDim2.new(1, 0, 0, 32),
			LayoutOrder = 2,
		}, {
			Text = Roact.createElement(TextLabel, {
				Text = "www.twitch.tv/",
				Size = UDim2.new(0.5, 0, 1, 0),
				[Roact.Ref] = self.inputRef,
			}),
			Input = Roact.createElement(TextBox, {
				Size = UDim2.new(0.5, 0, 1, 0),
				Text = "",
			}),
		}),
		LogIn = Roact.createElement(TextButton, {
			Text = "Log In",
			[Roact.Events.Activated] = self.onSubmit,
		})
	})
end

return RoactRodux.connect(function(state, props)
	return {}
end, function(dispatch)
	return {
		dispatchSetChannelName = function(channelName : string)
			dispatch(SetChannelName(channelName))
		end,
	}
end) LoginView