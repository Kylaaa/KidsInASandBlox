local atomsFolder = script.Parent
local createAtom = require(atomsFolder.createAtom)

return createAtom(script.Name, {
	PaddingBottom = UDim.new(0, 8),
	PaddingLeft = UDim.new(0, 8),
	PaddingRight = UDim.new(0, 8),
	PaddingTop = UDim.new(0, 8),
})