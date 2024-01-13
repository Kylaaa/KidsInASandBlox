/*
    The entrypoint to the node server.
    Initializes controllers with service, and starts the server.
*/
const express = require('express');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const AppController = require('./src/controllers/app.controller.js');
const commands = require('./src/utils/commands.js');
const config = require('./src/config/app.config.json');
const createAppRouter = require('./src/routes/app.route.js');
const createEventsRouter = require('./src/routes/events.route.js');
const DbService = require('./src/services/db.service.js');
const EventsController = require('./src/controllers/events.controller.js');
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
let ts = new TwitchService(ls, dbs);

// create the public controllers and the endpoints that access their methods
let appController = new AppController(ls, dbs, ts);
let appRouter = createAppRouter(appController);

let eventsController = new EventsController(ls, dbs, ts);
let eventsRouter = createEventsRouter(eventsController);

// construct the docs
const options = {
    definition: {
        openapi: config.DOCUMENTATION_INFO.openapi,
        info: {
            title : `${config.APP_NAME} API Documentation with Swagger`,
            version : config.VERSION,
            description : config.DOCUMENTATION_INFO.description,
            license : config.DOCUMENTATION_INFO.license,
            contact: config.DOCUMENTATION_INFO.contact,
        },
        servers: [
            { url: `http://localhost:${config.PUBLIC_PORT}` },
        ],
    },
    apis: [
        "./src/models/*.js",
        "./src/routes/*.route.js"
    ]
};
const specs = swaggerJsdoc(options);


// configure the local server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// connect the API
app.use(`/app`, appRouter);
app.use('/events', eventsRouter);
if (config.ENABLE_DEBUG_ENDPOINTS) {
    const createDebugRouter = require('./src/routes/debug.route.js');
    let debugRouter = createDebugRouter(dbs, ls, ts);
    app.use(`/debug`, debugRouter);
}
app.use(`/docs`, swaggerUi.serve, swaggerUi.setup(specs, {explorer:true}));



// connect the CLI commands
commands.onRun.connect(function(){
    // launch the local server
    app.listen(config.PUBLIC_PORT, function(){
        ls.message(`${new Date()} ${config.APP_NAME} is listening on port ${config.PUBLIC_PORT}`);
    });

    // gracefully handle shutdowns
    process.on('SIGTERM', ()=>{
        dbs.close();
        app.close();
    });
});

commands.onLogin.connect(function(){
    ls.message("Logging in...");
});

commands.onLogout.connect(function(){
    ls.message("Logging out...");
});

commands.program.parse(process.argv);