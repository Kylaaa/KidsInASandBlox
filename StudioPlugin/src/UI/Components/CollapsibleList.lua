local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local Libs = plugin.Libs
local Roact = require(Libs.Roact)


local MainUI = Roact.PureComponent:extend(script.Name)

function MainUI:render()
	return Roact.createElement("TextLabel", {
		Size = UDim2.new(1, 0, 1, 0),
		Text = "Hello world",
	})
end

return MainUI