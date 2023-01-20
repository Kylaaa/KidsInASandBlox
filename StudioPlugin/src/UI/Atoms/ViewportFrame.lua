local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local Cryo = require(Libs.Cryo)

local Atoms = script.parent
local Camera = require(Atoms.Camera)

local ViewportFrame = Roact.PureComponent:extend(script.Name)

ViewportFrame.defaultProps = {
	BackgroundTransparency = 1.0,
	Position = UDim2.fromScale(1, 1),
	Size = UDim2.fromScale(1, 1),
}

function ViewportFrame:init()
	self.cameraRef = Roact.createRef()
end

function ViewportFrame:render()
    local elementProps = Cryo.Dictionary.join(self.props, {
    	CurrentCamera = if self.props.Camera then nil else self.cameraRef:getValue(),
		[Roact.Children] = Cryo.None,
	})
	local children = Cryo.Dictionary.join({
		Camera = Roact.createElement(Camera, {
			[Roact.Ref] = self.cameraRef,
		}), self.props[Roact.Children],
	})
	return Roact.createElement("ViewportFrame", elementProps, children)
end

return ViewportFrame