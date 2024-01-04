const config = require('./../config/app.config.json');
const signal = require('./signal.js');

const { Command } = require('commander');

const onRun = new signal("OnRun");
const onLogin = new signal("OnLogin");
const onLogout = new signal("OnLogout");
const onConfigure = new signal("OnConfigure");

const program = new Command();

program
    .name(config.APP_NAME)
    .version(config.VERSION)
    .action(()=>{
        onRun.fire();
    });

program
    .description(config.DESCRIPTION);

program.command('configure')
    .description('Change a value stored in configuration')
    .action(onConfigure.fire);

program.command('login')
    .description('Log into a Twitch account through an OAuth2.0 window')
    .action(onLogin.fire);

program.command('logout')
    .description('Clears the currently authenticated session')
    .action(onLogout.fire);

module.exports = {
    onRun : onRun,
    onConfigure : onConfigure,
    onLogin : onLogin,
    onLogout : onLogout,

    // the caller will handle calling the parse function
    program : program
};