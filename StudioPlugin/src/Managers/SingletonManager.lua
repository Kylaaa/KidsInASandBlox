local SingletonManager = {}
SingletonManager.__index = SingletonManager

function SingletonManager.new()
	local self = {
		singletonModules = {}, -- { Instance }
		dependencies = {}, -- { Instance, { Instance }}
		names = {}, -- { Instance, string }
		
		-- initialized objects
		singletons = {}, -- { string, table }
	}
	setmetatable(self, SingletonManager)

	return self
end

function SingletonManager:registerSingleton(moduleScript : ModuleScript, dependencies : { ModuleScript })
	--
	table.insert(self.singletonModules, moduleScript)
	self.dependencies[moduleScript] = dependencies
end

function SingletonManager:initialize()
	-- sort the list of singletons by number of dependencies ASC
	table.sort(self.singletonModules, function(a, b)
		return #self.dependencies[a] < #self.dependencies[b]
	end)
	
	-- TODO : CHECK FOR CIRCULAR DEPENDENCIES... later
	local function getDependencies(module : ModuleScript)
		-- lookup if there are any dependencies
		local dependencies = self.dependencies[module]
		local values = {}
		if #dependencies > 0 then
			-- check that the dependencies have been initialized
			for _ , module : ModuleScript in ipairs(dependencies) do
				local initializedValue = self.singletons[module.Name]
				if not initializedValue then
					-- grab its dependencies
					local dependencies = getDependencies(module)
					local manager = require(module)
					initializedValue = manager.new(dependencies)
					
					-- hold onto it for later
					self.singletons[module.Name] = initializedValue
				end
				
				values[module.Name] = initializedValue
			end 
		end
		return values
	end
	
	--
	for _, module : ModuleScript in ipairs(self.singletonModules) do
		local singleton = self.singletons[module.Name]
		if not singleton then
			local manager = require(module)
			local dependencies = getDependencies(module)
			self.singletons[module.Name] = manager.new(dependencies)
		end
	end
end

function SingletonManager:get(managerName : string)
	local manager = self.singletons[managerName]
	assert(manager ~= nil, "COULD NOT FIND MANAGER WITH NAME " .. managerName)
	return manager
end


return SingletonManager
