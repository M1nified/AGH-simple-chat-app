'use strict';
var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var clients = [];
var history = [];

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  let clindex = clients.push(ws);
  // console.log(ws);
  // var id = setInterval(function() {
  //   ws.send(JSON.stringify(new Date()), function() {  })
  // }, 1000)
  ws.send((function(){
    let histjson = JSON.stringify(history);
    let json = {
      type : "history",
      history : histjson
    }
    return json;
  }()))
  console.log("websocket connection open")
  ws.on("message",function(msg){
    console.log('message: ',msg);
    var ms;
    try{
      ms = JSON.parse(msg)
    }catch(e){
      ms = {};
      return;
    }
    history.push(msg);
    history = history.slice(-100);
    for(let client of clients){
      try{
        client.send(msg);
      }catch(e){
        console.log('CLIENT EXCEPTION',e);
      }
    }

  })
  ws.on("close", function() {
    console.log("websocket connection close")
    // clearInterval(id)
    clients.splice(clindex,1)
  })
})
