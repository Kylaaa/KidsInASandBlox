local Action = require(script.Parent.Action)

return Action(script.Name, function(level : number, message : string)
	return {
		level = level,
		message = message,
	}
end)