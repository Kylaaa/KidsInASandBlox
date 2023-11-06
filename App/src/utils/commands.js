const config = require('./../config/app.config.json');
const signal = require('./signal.js');

const { program } = require('commander');

const onRun = signal("OnRun");
const onLogin = signal("OnLogin");
const onLogout = signal("OnLogout");


program
    .name(config.APP_NAME)
    .description(config.DESCRIPTION)
    .version(config.VERSION)
    .action(onRun.fire);

program.command('login')
    .description('Log into a Twitch account through an OAuth2.0 window')
    .action(onLogin.fire);

program.command('logout')
    .description('Clears the currently authenticated session')
    .action(onLogout.fire);


//program.parse(process.argv);

module.exports = {
    onRun : onRun,
    onLogin : onLogin,
    onLogout : onLogout

    // the caller will handle calling the parse function
    program : program
};