/*
    The entrypoint to the node server.
    Initializes controllers with service, and starts the server.
*/
const express = require('express');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const AppController = require('./src/controllers/app.controller.js');
const AuthController = require('./src/controllers/auth.controller.js');
const commands = require('./src/utils/commands.js');
const ConfigService = require('./src/services/config.service.js');
const createAppRouter = require('./src/routes/app.route.js');
const createAuthRouter = require('./src/routes/auth.route.js');
const createEventsRouter = require('./src/routes/events.route.js');
const createRootRouter = require('./src/routes/root.route.js');
const DbService = require('./src/services/db.service.js');
const EventsController = require('./src/controllers/events.controller.js');
const LogService = require('./src/services/logs.service.js');
const SessionService = require('./src/services/session.service.js');
const TwitchService = require('./src/services/twitch.service.js');

// initialize the services
let cfs = new ConfigService();
let ls = new LogService(cfs);
ls.OnMessage.connect(function(level, ...args){
    const outFunc = {
        1: console.error,
        2: console.warn,
        3: console.log,
        4: console.info
    };
    outFunc[level](...args);
});
let dbs = new DbService(cfs, ls);
let ss = new SessionService(cfs, ls);
let ts = new TwitchService(cfs, ls, ss, dbs);

// create the public controllers and the endpoints that access their methods
let appController = new AppController(ls, dbs, ss, ts);
let authController = new AuthController(ls, ss, ts);
let eventsController = new EventsController(ls, dbs, ss, ts);
let appRouter = createAppRouter(appController);
let authRouter = createAuthRouter(authController);
let eventsRouter = createEventsRouter(eventsController);
let rootRouter = createRootRouter();

// construct the docs
let DOCUMENTATION_INFO = cfs.getAppConfig("DOCUMENTATION_INFO");
const options = {
    definition: {
        openapi: DOCUMENTATION_INFO.openapi,
        info: {
            title : `${cfs.getAppConfig("APP_NAME")} API Documentation with Swagger`,
            version : cfs.getAppConfig("VERSION"),
            description : DOCUMENTATION_INFO.description,
            license : DOCUMENTATION_INFO.license,
            contact: DOCUMENTATION_INFO.contact,
        },
        servers: [
            { url: `http://localhost:${cfs.getAppConfig("PUBLIC_PORT")}` },
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

// serve up static files for UI
app.use(express.static(`public`));

// connect the API
app.use(rootRouter);
app.use('/app', appRouter);
app.use('/auth', authRouter);
app.use('/events', eventsRouter);
if (cfs.getAppConfig("ENABLE_DEBUG_ENDPOINTS")) {
    const createDebugRouter = require('./src/routes/debug.route.js');
    let debugRouter = createDebugRouter(dbs, ls, ts);
    app.use('/debug', debugRouter);
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer:true }));


// connect the CLI commands
commands.onRun.connect(function(){
    // launch the local server
    app.listen(cfs.getAppConfig("PUBLIC_PORT"), function(){
        ls.message(`${new Date()} ${cfs.getAppConfig("APP_NAME")} is listening on port ${cfs.getAppConfig("PUBLIC_PORT")}`);
    });

    // gracefully handle shutdowns
    process.on('SIGTERM', ()=>{
        dbs.close();
        ts.close();
        app.close();
    });
});

commands.onLogin.connect(function(){
    ls.message("Logging in...");
    ts.createOAuthWebview(`http://localhost:${cfs.getAppConfig("PUBLIC_PORT")}/auth/login`);
});

commands.onLogout.connect(function(){
    ls.message("Logging out...");
});

commands.createCommands(cfs).parse(process.argv);