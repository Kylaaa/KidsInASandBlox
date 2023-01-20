local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local Cryo = require(Libs.Cryo)

local Atoms = script.Parent
local ImageLabel = require(Atoms.ImageLabel)
local UICorner = require(Atoms.UICorner)

local ScrollingFrame = Roact.PureComponent:extend(script.Name)

ScrollingFrame.defaultProps = {
	BackgroundTransparency = 1.0,
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	CanvasSize = UDim2.fromScale(0, 0),
	AutomaticCanvasSize = Enum.AutomaticSize.X,
	ScrollingDirection = Enum.ScrollingDirection.X,
	HorizontalScrollBarInset = Enum.ScrollBarInset.ScrollBar,
}
ScrollingFrame.customPropFilter = {
	[Roact.Children] = Cryo.None,
}

function ScrollingFrame:render()
	local props = self.props
	local state = self.state

	local elementProps = Cryo.Dictionary.join(props or {}, ScrollingFrame.customPropFilter)
	local children = Cryo.Dictionary.join({
		Corner = Roact.createElement(UICorner),
	}, self.props[Roact.Children] or {})
	return Roact.createElement("ScrollingFrame", elementProps, Cryo.Dictionary.join(
		{
			Corner = Roact.createElement(UICorner, {
				CornerRadius = UDim.new(0.2, 0),
			})
		}, Roact.Children or {})
	)
end

return ScrollingFrame