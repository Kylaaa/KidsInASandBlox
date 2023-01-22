local Action = require(script.Parent.Action)

return Action(script.Name, function(eventName : string, eventVersion: number, isOn : bool)
	return {
		eventName = eventName,
		eventVersion = eventVersion,
		isOn = isOn,
	}
end)