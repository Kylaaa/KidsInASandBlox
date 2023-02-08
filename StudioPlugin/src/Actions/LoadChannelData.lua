local Action = require(script.Parent.Action)

return Action(script.Name, function(eventData : {})
	assert(eventData.name ~= nil)
	assert(eventData.version ~= nil)
	assert(eventData.scope ~= nil)
	assert(eventData.condition ~= nil)
	assert(eventData.shouldObserve ~= nil)
	return {
		eventData = eventData,
	}
end)