local Players = game:GetService("Players")

local NPCManager = {}
NPCManager.__index = NPCManager

function NPCManager.new(dependencies)
	local npcm = {
		characters = {}, -- string, Model
	}
	setmetatable(npcm, NPCManager)
	return npcm
end

function NPCManager:createCharacter(userId : number) : Model
	local description = Players:GetHumanoidDescriptionFromUserId(userId)
	local model = Players:CreateHumanoidModelFromDescription(description)
	return model
end

function NPCManager:destroyCharacter()

end

return NPCManager