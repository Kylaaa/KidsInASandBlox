/*
	A web socket client to listen for messages from Twitch
*/

const config = require('./config.json')
const webview = require('./webview.js')

const http = require('http');

var authToken = {};

module.exports = {
	authenticate : ()=>{

	},

	getBroadcasterId : (channelUrl)=>{
		// split the channel url to get the username

	}
}