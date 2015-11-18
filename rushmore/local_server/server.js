// Require the SocketIO library
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var port = 80;

// Serve static files from the app folder
app.use(express.static('./rushmore/app'));

// Serve the index file when naivating to /
app.get('/', function(req, res) {
    res.sendFile(path.resolve('./rushmore/app/index.html'));
});

// Open up and listen to port
// This is also the port number for socket io
http.listen(port, function() {
    console.log('http server listening on *:' + port);
});
