local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local LibsFolder = plugin.Libs
local Rodux = require(LibsFolder.Rodux)

local ActionsFolder = plugin.Actions
local LoggedMessage = require(ActionsFolder.LoggedMessage)

local ReducersFolder = plugin.Reducers
local MainReducer = require(ReducersFolder.MainReducer)


local StateManager = {}
StateManager.__index = StateManager

function StateManager.new(dependencies : {})
	local lm = dependencies.LogManager

	local store = Rodux.Store.new(MainReducer, nil, {
		--Rodux.thunkMiddleware,

		-- for debugging, enable the logger to observe all the events passing through and the state changes they enable
		--Rodux.loggerMiddleware,
	})

	local connection = lm.NewMessage:Connect(function(logLevel, message)
		store:dispatch(LoggedMessage(logLevel, message))
	end)

	local sm = {
		storeRef = store,
		connections = { connection },
	}
	setmetatable(sm, StateManager)

	return sm
end

return StateManager