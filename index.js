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
  var connection = request.accept(null, request.origin);
  var index = clients.push(connection) - 1;
  if(history.length>0){
    ws.send(JSON.stringify( { type: 'history', data: history} ))
  }
  ws.on("message",function(message){
    var msg;
      try{
        msg = JSON.parse(message.utf8Data);
      }catch(e){
        msg = null;
      }
      if (msg){ // log and broadcast the message
        console.log((new Date()) + ' Received Message: ' + message.utf8Data);

        // we want to keep history of all sent messages
        var obj = {
          time: (new Date()).getTime(),
          msg: msg
        };
        history.push(obj);
        history = history.slice(-100);

        // broadcast message to all connected clients
        var json = JSON.stringify({ type:'message', data: obj });
        console.log(clients.length);
        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
      }
    }
  })
  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
    clients.splice(index,1);
  })
})
