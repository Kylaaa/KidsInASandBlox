local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local Cryo = require(Libs.Cryo)

local Atoms = script.Parent
local ImageLabel = require(Atoms.ImageLabel)
local UICorner = require(Atoms.UICorner)

local ImageButton = Roact.PureComponent:extend(script.Name)

ImageButton.defaultProps = {
	AutomaticSize = Enum.AutomaticSize.XY,
	BackgroundColor3 = Color3.fromRGB(255, 224, 153),
	BackgroundTransparency = 1.0,
	ClipsDescendants = false,
	ImageColor = Color3.fromRGB(255,255,255),
	Size = UDim2.new(1, -8, 0, 32),
	Enabled = true,
	
	-- CustomProps
	Selectable = false,
}
ImageButton.customPropFilter = {
	[Roact.Children] = Cryo.None,
	Selectable = Cryo.None,
}

function ImageButton:init()
	self.state = {
		isHovered = false,
		isPressed = false,
		isSelected = false,
	}
	self.onMouseEnter = function()
		if not self.props.Enabled then
			return
		end
		self:setState({
			isHovered = true,
		})
	end
	self.onMouseLeave = function()
		if not self.props.Enabled then
			return
		end
		self:setState({
			isHovered = false,
		})
	end
	self.onMouseDown = function()
		if not self.props.Enabled then
			return
		end
		self:setState({
			isPressed = true,
		})
	end
	self.onMouseUp = function()
		if not self.props.Enabled then
			return
		end
		self:setState({
			isPressed = false,
		})
	end
	self.onActivated = function()
		if not self.props.Selectable then
			return
		end
		if not self.props.Enabled then
			return
		end
		
		self:setState({
			isSelected = not self.state.isSelected,
		})
	end
end

function ImageButton:render()
	local props = self.props
	local state = self.state
	
	local isEnabled = props.Enabled
	local isSelected = state.isSelected
	local isPressed = state.isPressed
	local isHovered = state.isHovered
	
	local imageTint
	local borderTint
	if not isEnabled then
		imageTint = Color3.new(1, 1, 1)
		borderTint = Color3.new(1, 1, 1)
	else
		local baseColor = Vector3.new(0.9, 0.9, 0.9)
		local baseBorderColor = Vector3.new(0.9, 0.9, 0.9)
		
		if isHovered then
			baseColor += Vector3.new(0.1, 0.1, 0.1)
			baseBorderColor += Vector3.new(0.1, 0.1, 0.1)
		end
		
		if isPressed then
			baseColor -= Vector3.new(0.2, 0.2, 0.2)
			baseBorderColor -= Vector3.new(0.2, 0.2, 0.2)
		end
		
		if isSelected then
			baseColor -= Vector3.new(0.1, 0.15, 0.0)
			baseBorderColor -= Vector3.new(0.1, 0.15, 0.0)
		end
		
		imageTint = Color3.fromRGB(baseColor.X * 255, baseColor.Y * 255, baseColor.Z * 255)
		borderTint = Color3.fromRGB(borderTint.X * 255, borderTint.Y * 255, borderTint.Z * 255)
	end
	
	local elementProps = Cryo.Dictionary.join(props or {}, ImageButton.customPropFilter, {
		ImageColor = imageTint,
		[Roact.Event.MouseEnter] = self.onMouseEnter,
		[Roact.Event.MouseLeave] = self.onMouseExit,
		[Roact.Event.MouseDown] = self.onMouseDown,
		[Roact.Event.MouseUp] = self.onMouseUp,
		[Roact.Event.Activated] = self.onActivated,
	})
	local children = Cryo.Dictionary.join({
		Corner = Roact.createElement(UICorner, {
			CornerRadius = UDim.new(0.2, 0),
		}),
	}, self.props[Roact.Children] or {})
	return Roact.createElement("ImageButton", elementProps, children)
end

return ImageButton