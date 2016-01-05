var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)
// latest 100 messages
var history = [ ];
// list of currently connected clients (users)
var clients = [ ];

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  console.log("websocket connection open, from:",ws)
  // var id = setInterval(function() {
  //   ws.send(JSON.stringify(new Date()), function() {  })
  // }, 1000)
  var index = clients.push(ws)
  if(history.length>0){
    ws.send(JSON.stringify( { type: 'history', data: history} ))
  }
  ws.on("message",function(msg){
    console.log(msg);
    history.push(msg);
    history = history.slice(-100);
  })
  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})
