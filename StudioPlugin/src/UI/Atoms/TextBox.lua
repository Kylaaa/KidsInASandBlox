local Atoms = script.Parent
local UICorner = require(Atoms.UICorner)

local TextBox = Roact.PureComponent:extend(script.Name)

TextBox.defaultProps = {
	AutomaticSize = Enum.AutomaticSize.XY,
	BackgroundColor3 = Color3.fromRGB(255, 224, 153),
	Font = Enum.Font.Merriweather,
	Size = UDim2.new(1, -8, 0, 32),
	Text = "TEXT_BOX",
	TextColor3 = Color3.fromRGB(213, 212, 191),
	TextStrokeColor3 = Color3.fromRGB(26, 26, 26),
	TextScaled = true,
	TextWrapped = true,
	--AutoLocalize = false,
}

function TextBox:render()
	local elementProps = Cryo.Dictionary.join(self.props or {}, {
		[Roact.Children] = Cryo.None,
	})
	local children = Cryo.Dictionary.join({
		Corner = Roact.createElement(UICorner),
	}, self.props[Roact.Children] or {})
	return Roact.createElement("TextBox", elementProps, children)
end

return TextButton