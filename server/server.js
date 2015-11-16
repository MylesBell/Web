// Require the SocketIO library
var socketio = require('socket.io');
var housekeeping = require('./housekeeping');
var mobile = require('./mobile');

var port = 1337;

// Start listening on a non-root-locked port
var io = socketio.listen(port);
var UNITY_CHAN = "unity";
var MOBILE_CHAN = "mobile";

console.log("socket server listening on " + port)

io.on('connection', function(socket) {
    housekeeping.connect(socket);

    socket.on('disconnect', function(data) {
        housekeeping.disconnect(socket, data);
    })

    socket.on('subscribe', function(data) {
        housekeeping.subscribe(socket, data);
    });

    socket.on('playerRegister', function(data) {
        var res = mobile.register(socket, data);
        if(res.ok){
            io.sockets.in(UNITY_CHAN).emit('playerJoin', res);
        }
    });

    socket.on('playerDirection', function(data) {
        var res = mobile.playerDirection(socket, data);
        if(res.ok){
            io.sockets.in(UNITY_CHAN).emit('playerDirection', res);
        }
    });
});
