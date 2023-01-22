local Action = require(script.Parent.Action)

return Action(script.Name, function(eventName : string)
	return {
		eventName = eventName,
	}
end)