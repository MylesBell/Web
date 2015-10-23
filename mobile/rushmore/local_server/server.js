// Require the SocketIO library
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 7777;

// Serve static files from the app folder
app.use(express.static('app'));

// Serve the index file when naivating to /
app.get('/', function(req, res){
  res.sendFile('index.html');
});

// Open up and listen to port
// This is also the port number for socket io
http.listen(port, function(){
  console.log('listening on *:' + port);
});


io.on('connection', function(socket){
    // As SocketIO doesn't include namespace protocols,
    // we implement our own room system
    console.log("Client ["+socket.id+"] connected");
   
    socket.emit('setup', {data: 123});

    // PoC test to show broadcast events from one group
    // to all elements in another group
    socket.on('message', function (data) {
        console.log("["+socket.id+"] message to "+data.name);
        io.sockets.in(data.name).emit('message', data);
    });
});