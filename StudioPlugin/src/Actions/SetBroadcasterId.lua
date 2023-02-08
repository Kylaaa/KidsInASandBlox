local Action = require(script.Parent.Action)

return Action(script.Name, function(broadcasterId : number)
	return {
		broadcasterId = broadcasterId,
	}
end)