local StudioService = game:GetService("StudioService")

plugin.Name = "TwitchBlox"

plugin.Unloading:connect(function()
	
end)
--[[
local info = DockWidgetPluginGuiInfo.new(
	Enum.InitialDockState.Float,
	true, -- Enabled
	true, -- disregardPreviousState
	300, -- X
	200, -- Y
	100, -- minX
	100 -- minY
) 
local gui = plugin:CreateDockWidgetPluginGui("TwitchBlox", info)

local title = Instance.new("TextLabel", gui)
title.Text = "Hello world"
title.Size = UDim2.new(1, 0, 1, 0)

]]

local mdii = plugin.MultipleDocumentInterfaceInstance
mdii.DataModelSessionStarted:Connect(function(session)
	print("Data model session started : ", session)
end)

mdii.DataModelSessionEnded:Connect(function(session)
	print("session ending : ", session)
end)