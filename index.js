//----------------------------------------------------------------------
//--- tailing
//----------------------------------------------------------------------
var Tail = require('always-tail2');
var fs = require('fs');
var filename = "/bj/temp/tail.txt";
 
if (!fs.existsSync(filename)) fs.writeFileSync(filename, "");
 
var tail = new Tail(filename, '\n');
 
tail.on('line', function(data) {
  console.log("got line:", data);
  broadcast(data);
  data='';
});

tail.on('error', function(data) {
  console.log("error:", data);
});

tail.watch();
//----------------------------------------------------------------------


//----------------------------------------------------------------------
//--- parsing
//----------------------------------------------------------------------
//----------------------------------------------------------------------


//----------------------------------------------------------------------
//--- communication
//----------------------------------------------------------------------
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('new client', function() {
    console.log('a new client connected: ' + socket.id);
    //todo: send all TA records to the new client
  });
});

function broadcast(data){
    io.emit('status change', data)
}

http.listen(3000, function(){
  console.info("you can open now http://localhost:3000/")
});
//----------------------------------------------------------------------
