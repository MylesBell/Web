// Require the SocketIO library
var socketio = require('socket.io');

var UNITY_CHAN = "unity";
var MOBILE_CHAN = "mobile";


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
        if(res.ok){
            io.sockets.in(UNITY_CHAN).emit('playerJoin', res);
        }
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
        if(res.ok){
            io.sockets.in(UNITY_CHAN).emit('playerDirection', res);
        }
    },

};
