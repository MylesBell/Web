/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('NetworkService', function($q, socket) {
    socket.emit("subscribe", {"name" : "mobile"});

    socket.on('gameStateUpdate', function (data) {
        alert(data.state);
    });

    socket.on('gamePlayerJoined', function (data) {
        alert("Joined "+data.team);
        alert("Game is "+data.state);
    });

    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        send: send
    };

    // Sends a message over the socket to the server
    // takes a callback that calls when the server handles the response
    function send(eventName, msg) {
        socket.emit(eventName, msg);
    }
});