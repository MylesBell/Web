/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('NetworkService', function($q, socket) {
    
    var listenerEventList = {};
    
    socket.emit("subscribe", {"name" : "mobile"});

    socket.on('gameStateUpdate', function (data) {
        alert(data.state);
    });

    socket.on('gamePlayerJoined', function (data) {
        alert("Joined "+data.team);
        alert("Game is "+data.state);
        
        alertListeners("gamePlayerJoined", data);
    });
    
    function alertListeners(eventName, eventData){
        listenerEventList.forEach(function(listener) {
            if(listener.eventName === eventName){
                var call = listener.call;
                call(eventData);
            }
        }, this);
    }

    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        send: send,
        registerListener: registerListener
    };

    // Sends a message over the socket to the server
    // takes a callback that calls when the server handles the response
    function send(eventName, msg) {
        socket.emit(eventName, msg);
    }
    
    function registerListener(listenerEvent) {
        listenerEventList.add(listenerEvent);
    }
});