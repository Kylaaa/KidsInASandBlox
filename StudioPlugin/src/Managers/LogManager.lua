local plugin = script:FindFirstAncestorOfClass("Plugin").TwitchBloxPlugin

local LibsFolder = plugin.Libs
local Signal = require(LibsFolder.Signal)


local LogManager = {}
LogManager.__index = LogManager

LogManager.LogLevel = {
	None = 0,
	Error = 1,
	Warning = 2,
	Message = 3,
	Trace = 4,
}

function LogManager.new(dependencies : {})
	local cm = dependencies.ConfigurationManager

	local lm = {
		logLevel = cm:getValue("LOGGING_LEVEL"),
		NewMessage = Signal.new(), -- (logLevel : number, message : string) -> ()
	}
	setmetatable(lm, LogManager)

	return lm
end

function LogManager:log(level : number, message : string)
	assert(level ~= LogManager.LogLevel.None, "level cannot be `None`")

	if level <= self.LogLevel then
		self.NewMessage(level, message)
	end
end

function LogManager:error(message : string)
	self:log(LogManager.Error, message)
end

function LogManager:warn(message : string)
	self:log(LogManager.Warning, message)
end

function LogManager:message(message : string)
	self:log(LogManager.Message, message)
end

function LogManager:trace(message : string)
	self:log(LogManager.Trace, message)
end

return LogManager