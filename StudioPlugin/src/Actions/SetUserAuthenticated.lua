local Action = require(script.Parent.Action)

return Action(script.Name, function(isAuthenticated : boolean)
	return {
		isAuthenticated = isAuthenticated,
	}
end)