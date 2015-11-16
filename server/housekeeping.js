// Require the SocketIO library
var socketio = require('socket.io');

module.exports = {
    // Log whenever a client joins
    connect: function(socket){
        console.log("Client [" + socket.id + "] connected");
    },

    // Log the client disconnects
    disconnect: function (socket, data) {
        console.log("Client [" + socket.id + "] dis-connected");
    },

    // As SocketIO doesn't include namespace protocols,
    // we implement our own room system using joins
    subscribe: function (socket, data) {
        console.log("[" + socket.id + "] joined " + data.name);
        socket.join(data.name);
    },
};
