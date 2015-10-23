
/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('NetworkService', function($q, socket) {
    
    

    // Sends a message over the socket to the server
    // Returns a promise resolved when the message is sent
    function send (eventName, msg) {
        var deferred = $q.defer();

        socket.emit(eventName, msg);
        deferred.resolve();

        return deferred.promise;
    }

    socket.on('setup', function(msg){
        console.log(msg);
    });


    return {
        send: send
    };

});