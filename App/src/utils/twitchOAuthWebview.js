/*
	A webview for authenticating the Twitch user
*/

const config = require('./../config/app.config.json');
const webview = require("webview");
const uuidv4 = require('uuid').v4;
const constructUrl = require('./constructUrl.js')

module.exports = function(scopes) {
	const args = {
		"response_type" : "token",
		"client_id" : config.CLIENT_ID,
		"redirect_uri" : 'http://localhost:${config.PUBLIC_PORT}/authenticate',
		"scope" : scopes.join('+'),
		"state" : uuidv4()
	};
	const targetUrl = constructUrl("https://id.twitch.tv/oauth2/authorize?", args);
	console.log(targetUrl);

	// the webview will redirect the the url specified in the 'redirect_url' argument
	return webview.spawn({
		title : config.APP_NAME,
		width : config.LOGIN_VIEW_SIZE.WIDTH,
		height : config.LOGIN_VIEW_SIZE.HEIGHT,
		url : targetUrl
	});
};