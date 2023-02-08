local Action = require(script.Parent.Action)

return Action(script.Name, function(channelName : string)
	return {
		channelName = channelName,
	}
end)