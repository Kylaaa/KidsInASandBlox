Checks to make on startup



DataModel session starts...
 - Studio loads previous session data

0) Studio needs to check for the connection to the localhost
1) Start local server, wait for Studio

Studio asks if authenticated, if no...
) Studio sets channel name
) Studio sends a list of scopes to localhost
) Studio requests login
- localhost serves up a login webview
- webview redirect url provides auth token
- localhost fetches and returns broadcasterId
) Studio updates local information, sends list of events to observe to localhost
) Studio requests connection
- localhost establishes connection to the Twitch websocket
- localhost subscribes to events
- localhost keeps the connection alive


Studio asks if authenticated, if yes...

