/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('NetworkService', function($q, socket) {


    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        send: send
    };

    // Sends a message over the socket to the server
    // takes a callback that calls when the server handles the response
    function send(eventName, msg, callback) {
        socket.emit(eventName, msg, callback);
    }


    /*----------------
    SOCKET EVENT HANDLERS

    -----------------*/
    socket.on('setup', function(msg) {
        console.log(msg);
    });

});