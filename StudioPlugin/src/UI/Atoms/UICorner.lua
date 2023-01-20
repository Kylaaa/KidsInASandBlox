local atomsFolder = script.Parent
local createAtom = require(atomsFolder.createAtom)

return createAtom(script.Name, {
	CornerRadius = UDim.new(0, 12),
})