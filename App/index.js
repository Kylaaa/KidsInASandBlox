/*
    The entrypoint to the node server.
    Initializes controllers with service, and starts the server.
*/

const AppController = require('./src/controllers/app.controller.js');
const commands = require('./src/utils/commands.js');
const config = require('./src/config/app.config.json');
const createAppRouter = require('./src/routes/app.route.js');
const DbService = require('./src/services/db.service.js');
const EventsService = require('./src/services/events.service.js');
const express = require('express');
const LogService = require('./src/services/logs.service.js');
const TwitchService = require('./src/services/twitch.service.js');


let ls = new LogService();
ls.OnMessage.connect(function(level, ...args){
    const outFunc = {
        1: console.error,
        2: console.warn,
        3: console.log,
        4: console.info
    };
    outFunc[level](...args);
});

let dbs = new DbService(ls);
let evts = new EventsService(ls, dbs);
let ts = new TwitchService(ls, evts);

let appController = new AppController(ls, evts, ts);
let appRouter = createAppRouter(appController);



commands.onRun.connect(function(){
    // configure the local server
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(appRouter);

    // gracefully handle shutdowns
    process.on('SIGTERM', ()=>{
        dbs.close();
        app.close();
    });

    // launch the local server
    app.listen(config.PUBLIC_PORT, function(){
        ls.message(`${new Date()} ${config.APP_NAME} is listening on port ${config.PUBLIC_PORT}`);
    });
});

commands.onLogin.connect(function(){
    ls.message("Logging in...");
});

commands.onLogout.connect(function(){
    ls.message("Logging out...");
});

commands.program.parse(process.argv);