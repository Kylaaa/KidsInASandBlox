local atomsFolder = script.Parent
local createAtom = require(atomsFolder.createAtom)

return createAtom(script.Name, {
	AnchorPoint = Vector2.new(0, 0),
	Size = UDim2.fromScale(1, 1),
	Position = UDim2.fromScale(0, 0),
	BackgroundTransparency = 1.0,
})