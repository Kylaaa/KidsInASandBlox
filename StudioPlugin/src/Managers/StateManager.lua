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
	local cm = dependencies.ConfigurationManager
	local lm = dependencies.LogManager
	local pm = dependencies.PersistenceManager

	local previousStateKey = pm:getPreviousStateKey()
	local previousState = pm:loadSetting(previousStateKey)

	local overrideSettings = cm:getValue("DEBUG_OVERRIDE_SETTINGS")
	if overrideSettings then
		previousState = nil
	end

	print("Initializing the previous state with : ", previousState)
	local store = Rodux.Store.new(MainReducer, previousState, {
		--Rodux.thunkMiddleware,

		-- for debugging, enable the logger to observe all the events passing through and the state changes they enable
		--Rodux.loggerMiddleware,
	})
	print("State : ", store:getState())
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