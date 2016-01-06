'use strict';
var WebSocketServer = require("ws").Server
class Chat{
  constructor(_server,_id){
    if(!_server){
      throw 'NO SERVER SPECIFIED';
    }
    _id = _id || 'global'
    console.log('New chat:',_id)
    this.id = _id;
    this.server = _server;
    this.clients = [];
    this.history = [];
    this.webSocketServer = null;//WebSocketServer
    this.port = process.env.PORT || 5000;
    this.runWebSocket();
  }
  runWebSocket(){
    this.webSocketServer = new WebSocketServer({
      server : this.server
    })
    this.webSocketServer.on("connection",this.wssOnConnection.bind(this));
  }
  wssOnConnection(_websocket){
    let client = _websocket;
    this.clients.push(this.websocket);
    client.on("message",this.wsOnMessage.bind(this));
    client.on("close",this.wsOnClose.bind(this));
    client.send(this.historyToJSON)
  }
  wsOnMessage(msgjson){
    console.log('message: ',msgjson);
    let msg;
    try{
      msg = JSON.parse(msgjson);
    }catch(e){
      return;
    }
    switch (msg.type) {
      case 'message':
      this.historyPush(msg);
      this.sendToAllClients(msgjson);
      break;
      case 'roomjoin':

      break;
    }
  }
  wsOnClose(){
    console.log("WebSocket CLOSED");
  }
  sendToAllClients(msg){
    for(let i=0;i<this.clients.length;i++){
      let client = this.clients[i];
      try{
        client.send(msg);
      }catch(e){
        console.log('CLIENT EXCEPTION');
        this.clients.splice(i,1);
        i--;
      }
    }
  }
  get historyToJSON(){
    let content = {
      type : "history",
      history : this.history
    }
    let json = JSON.stringify(content);
    return json;
  }
  historyPush(msg){
    this.history.push(msg);
    this.history = this.history.slice(-100);
  }
}
module.exports = Chat;
