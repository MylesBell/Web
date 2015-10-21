// Require the SocketIO library
var socketio = require('socket.io');

// Start listening on a non-root-locked port
var io = socketio.listen(1337);

io.on('connection', function(socket){
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