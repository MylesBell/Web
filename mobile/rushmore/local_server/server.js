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

    var username = "";

    console.log("Client ["+socket.id+"] connected");

    socket.on('user register', function (data, callback) {

        var res = {}

        if(data.username !== "") {
            username = data.username;
            res.ok = true;
            res.username = username;
        } else {
            res.ok = false;
        }

        console.log(res);

        callback(res);        
    });

    socket.on('user input', function (data, callback) {

        var res = {}
        var input = {};

        if(data.direction !== "") {
            input = data.input;
            res.ok = true;
            res.input = input;
        } else {
            res.ok = false;
        }

        console.log(res);

        callback(res);        
    });
});