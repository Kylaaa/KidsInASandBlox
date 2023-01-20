local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local Cryo = require(Libs.Cryo)

local Atoms = script.Parent
local UICorner = require(Atoms.UICorner)

local ImageLabel = Roact.PureComponent:extend(script.Name)

ImageLabel.defaultProps = {
	BackgroundTransparency = 1.0,
	Position = UDim2.new(0, 0, 0, 0),
	Size = UDim2.new(1, 0, 1, 0),
	ScaleType = Enum.ScaleType.Stretch,
}
ImageLabel.customPropFilter = {
	CornerRadius = Cryo.None,
	[Roact.Children] = Cryo.None,
}
function ImageLabel:render()
	local CornerRadius = self.props.CornerRadius
	
	local elementProps = Cryo.Dictionary.join(self.props or {}, ImageLabel.customPropFilter)
	local children = Cryo.Dictionary.join({
		Corner = Roact.createElement(UICorner, {
			CornerRadius = CornerRadius,
		}),
	}, self.props[Roact.Children] or {})
	return Roact.createElement("ImageLabel", elementProps, children)
end

return ImageLabel