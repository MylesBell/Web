// Require the SocketIO library
var socketio = require('socket.io');
var housekeeping = require('./housekeeping');
var mobile = require('./mobile');

var port = 1337;

// Start listening on a non-root-locked port
var io = socketio.listen(port);

var UNITY_CHAN = "unity";
var MOBILE_CHAN = "mobile";

console.log("socket server listening on " + port);

io.on('connection', function(socket) {
    housekeeping.connect(socket, housekeeping.logger);

    socket.on('disconnect', function(data) {
        housekeeping.disconnect(socket, housekeeping.logger);
    });

    socket.on('subscribe', function(data) {
        housekeeping.subscribe(socket, data, housekeeping.logger);
    });

    socket.on('playerRegister', function(data) {
        var res = mobile.register(socket, data, housekeeping.logger);

        if(res.ok){
            io.sockets.in(UNITY_CHAN).emit('playerJoin', res);
        }
    });

    socket.on('playerDirection', function(data) {
        var res = mobile.playerDirection(socket, data, housekeeping.logger);

        if(res.ok){
            io.sockets.in(UNITY_CHAN).emit('playerDirection', res);
        }
    });
});
