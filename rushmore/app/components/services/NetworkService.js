/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('NetworkService', function($q, socket) {
    
    var listenerEventList = [];
    
    socket.emit("subscribe", {"name" : "mobile"});

    socket.on('gameStateUpdate', function (data) {
        alert(data.state);
    });
    
    // called by the sever when a player has their request to join a game granted
    socket.on('gamePlayerJoined', function (data) {
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
    // Returns a promise that is fullilled or rejected by the server responce
    function send(eventName, msg) {
        var deferred = $q.defer();
        
        socket.emit(eventName, msg, function(res){
            console.log(res);
            if(res.ok){
                deferred.resolve(res);
            } else{
                deferred.reject(res);
            }
        });
        
               
        return deferred.promise;
    }
    
    function registerListener(listenerEvent) {
        listenerEventList.push(listenerEvent);
    }
});