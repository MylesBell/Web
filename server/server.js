// Require the SocketIO library
var socketio = require('socket.io');

var port = 1337;

// Start listening on a non-root-locked port
var io = socketio.listen(port);

console.log("socket server listening on " + port)

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

    // As SocketIO doesn't include namespace protocols,
    // we implement our own room system
    socket.on('subscribe', function (data) {
        console.log("["+socket.id+"] joined "+data.name);
        socket.join(data.name);
    });

    // PoC test to show broadcast events from one group
    // to all elements in another group
    socket.on('message', function (data) {
        console.log("["+socket.id+"] message to "+data.name);
        io.sockets.in(data.name).emit('message', data);
    });
});
