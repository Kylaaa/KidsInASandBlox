local atomsFolder = script.Parent
local createAtom = require(atomsFolder.createAtom)

return createAtom(script.Name, {
	CameraType = Enum.CameraType.Fixed,
	CFrame = CFrame.new(),
	FieldOfView = 70,
	BackgroundTransparency = 1.0,
})