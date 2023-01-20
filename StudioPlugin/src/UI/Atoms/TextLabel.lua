local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local Cryo = require(Libs.Cryo)

local Atoms = script.Parent
local UICorner = require(Atoms.UICorner)

local TextLabel = Roact.PureComponent:extend(script.Name)

TextLabel.defaultProps = {
	Size = UDim2.new(1, -8, 0, 32),
	BackgroundTransparency = 1.0,
	Font = Enum.Font.Merriweather,
	Text = "TEXT_LABEL",
	TextColor3 = Color3.fromRGB(213, 212, 191),
	TextStrokeColor3 = Color3.fromRGB(26, 26, 26),
	TextScaled = true,
	TextWrapped = true,
	--AutoLocalize = false,
}

function TextLabel:render()
	local elementProps = Cryo.Dictionary.join(self.props or {}, {
		[Roact.Children] = Cryo.None,
	})
	local children = Cryo.Dictionary.join({
		Corner = Roact.createElement(UICorner),
	}, self.props[Roact.Children] or {})
	return Roact.createElement("TextLabel", elementProps, children)
end

return TextLabel