const PORT = 3000;

var TEST_JSON = [
  {
    name : "spomgey",
    action : "cheer",
    message : "hello world"
  },
  {
    name : "itrxw",
    action : "wave",
    message : "",
  }
];

const express = require('express');
const http = require('http');
const WebSocketClient = require('websocket').client;
const W3CWebSocket = require('websocket').w3cwebsocket;

const app = express();

// Hold onto the messages
var messages = TEST_JSON;

app.get("/changes", function(request, response, next){
  // return the messages that have come in since
  // the last time they were requested
  response.json(messages);

  // clear out the message queue
  messages = {};
});
app.listen(PORT, function(){
  console.log(`${new Date()} Server is listening on port ${PORT}`);
})

/*var server = http.createServer(function(request, response) {
  console.log(request);
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.write(JSON.stringify(TEST_JSON));
  response.end();
});
server.listen(PORT, function() {
  console.log(`${new Date()} Server is listening on port ${PORT}`);
});*/