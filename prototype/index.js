//----------------------------------------------------------------------
//--- configuration
//----------------------------------------------------------------------
var TAs = [
    { name: "agent1", filename: "/bj/temp/agent1.txt" },
    { name: "agent2", filename: "/bj/temp/agent2.txt" },
];

//----------------------------------------------------------------------
//--- tailing
//----------------------------------------------------------------------
var Tail = require('always-tail2');
var fs = require('fs');

TAs.forEach(function (ta) {
    if (!fs.existsSync(ta.filename)) fs.writeFileSync(ta.filename, "");

    ta.tail = new Tail(ta.filename, '\n');

    ta.tail.on('line', function (data) {
        console.log("got line:", data);
        broadcast(ta, data);
        data = '';
    });

    ta.tail.on('error', function (data) {
        console.log("error:", data);
    });

    ta.tail.watch();
}, this);
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

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('new client', function () {
        console.log('a new client connected: ' + socket.id);
        //todo: send all TA records to the new client
    });
});

function broadcast(ta, data) {
    io.emit('status change', {agent: ta.name, change: data});
}

http.listen(3000, function () {
    console.info("you can open now http://localhost:3000/");
});
//----------------------------------------------------------------------
