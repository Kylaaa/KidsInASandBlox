/*
    The entrypoint to the node server.
    Initializes controllers with service, and starts the server.
*/
const logService = require('./services/logs.service.js').new()
const dbService = require('./services/db.service.js').new();
const eventsService = require('./services/events.service.js').new(dbService);
const twitchService = require('./services/twitch.service.js').new(dbService);

const appController = require('./controllers/app.controller.js')(eventsService, twitchService);
const appRoutes = require('./routes/app.route.js')(appController);

const commands = require('./utils/commands.js');

// DEBUG
logService.OnMessage.connect(function(level, ...args){
    const outFunc = {
        1: console.error,
        2: console.warn,
        3: console.log,
        4: console.info
    };
    outFunc[level](...args);
});


commands.onRun.connect(function(){
    // configure the local server
    /*const app = express();
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(appRoutes);

    // gracefully handle shutdowns
    process.on('SIGTERM', ()=>{
        dbService.close();
        app.close();
    });

    // launch the local server
    app.listen(config.PUBLIC_PORT, function(){
        console.log(`${new Date()} ${config.APP_NAME} is listening on port ${config.PUBLIC_PORT}`);
    });*/
    logService.log("Running!");
});

commands.onLogin.connect(function(){
    logService.log("Logging in...");
});

commands.onLogout.connect(function(){
    logService.log("Logging out...");
});