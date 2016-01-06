'use strict';
var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var Chat = require("./srv/Chat.js")
var app = express()
var port = process.env.PORT || 5000
app.use(express.static(__dirname + "/"))
app.get('/chat.js', function(req, res) {
  res.send('chat.js');
})
var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)

var chat = new Chat(server);
