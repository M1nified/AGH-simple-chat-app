'use strict';
$(()=>{
  var ws = null;
  var gothist = false;
  var runSocketTimeout = null;
  var runSocket = function runSocket(){
    clearTimeout(runSocketTimeout)
    var promise = new Promise((resolve,reject)=>{
      if("WebSocket" in window){
        var host = location.origin.replace(/^http/, 'ws')
        ws = new WebSocket(host);
        ws.onopen = function wsopen(){
          resolve();
        }
        ws.onmessage = function wsonmessage(msg){
          console.log(msg);
          var data = msg.data;
          try{
            data = JSON.parse(data);
          }catch(e){
            data = null;
          }
          if(data){
            if(data.type==='message'){
              printMsg(data);
            }else if(data.type==='history' && gothist === false){
              // gothist = true;
              $("#chat").val('');
              for(var m of data.history){
                printMsg(m)
              }
            }
          }
        }
        ws.onclose = function wsonclose(evt){
          runSocketTimeout = setTimeout(runSocket,1000);
        }
        ws.onerror = function wsonerror(evt){
          console.error(evt);
          // reject();
        }
      }else{
        reject('WebSocket NOT SUPPORTED');
      }
    })
    return promise;
  };
  runSocket();
  $(document.form).on('submit',function(event){
    event.preventDefault();
    var msg = {
      type: "message",
      text: $("#msg").val(),
      imie:   $("#imie").val() || 'anon',
      date: Date.now()
    };
    if(!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING){
      runSocket().then(()=>{
        ws.send(JSON.stringify(msg));
      }).catch((err)=>{
        console.error(err);
      })
    }else{
      ws.send(JSON.stringify(msg));
    }
    $("#msg").val('');
  })
  $("#isActive").change(function(e){
    if(this.checked){
      runSocket();
    }else{
      ws.close();
    }
  })
})
var printMsg = function(data){
  console.log(data);
  var chat = $("#chat");
  chat[0].value += '\n'+data.imie+': '+data.text;
  chat.scrollTop(chat.prop('scrollHeight'));
}
