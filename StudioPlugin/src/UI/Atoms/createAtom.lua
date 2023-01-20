--[[
	Creates a basic UI element
]]
local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local Libs = plugin.Libs
local Roact = require(Libs.Roact)
local Cryo = require(Libs.Cryo)

return function(name : string, defaultProps : {}) : {}
	local atom = Roact.PureComponent:extend(name)
	atom.defaultProps = defaultProps
	atom.customPropFilter = {
		[Roact.Children] = Cryo.None,
	}
	
	function atom:render()
		local elementProps = Cryo.Dictionary.join(self.props or {}, atom.customPropFilter)
		return Roact.createElement(name, elementProps)
	end

	return atom
end