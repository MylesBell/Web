// Require the SocketIO library
var socketio = require('socket.io');

module.exports = {
    // Register a new user with the system
    register: function(socket, data){
        var res = {}

        if (data.username !== "") {
            username = data.username;
            res.ok = true;
            res.username = username;
        } else {
            res.ok = false;
        }

        console.log(res);
        return res;
    },

    // Direction movement control for heroes
    moveDirection: function(socket, data){
        var res = {}
        var input = {};

        if (data.direction !== "") {
            input = data.input;
            res.ok = true;
            res.input = input;
        } else {
            res.ok = false;
        }

        console.log(res);
        return res;
    },

};
