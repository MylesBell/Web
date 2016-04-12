/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').
service('NetworkService', function($q, socket, StorageService, $rootScope, Idle) {
    $rootScope.events = [];

    $rootScope.$on('IdleStart', function() {
        console.log("Player is now idle");
    });

    $rootScope.$on('IdleWarn', function(e, countdown) {
        // Do we want to warn the user?
    });

    $rootScope.$on('IdleTimeout', function() {
        socket.disconnect();
        $rootScope.$apply(function() {
            alertListeners("locationChange", "/");
        });
        Idle.watch();
    });

    listenerEventList = [];

    //check on connect if we have connected previous (cookie or local storage)
    //send that data to the server
    socket.on("connect", function(data) {
        // get the  client user id in session storage, if it exists
        // var existingID = StorageService.get("uID");
        // TODO actuallt do this
        // TODO get userid back from the server
        var existingID = 0;

        socket.emit("subscribe", {
            name: "mobile",
            existingID: existingID
        });
    });

    socket.on("locationChange", function(data) {
        alertListeners("locationChange", data);
    });

    socket.on('gameStateUpdate', function(data) {
        alertListeners("gameStateUpdate", data);
    });

    // called by the sever when a player has their request to join a game granted
    socket.on('gamePlayerJoined', function(data) {
        alertListeners("gamePlayerJoined", data);
    });

    socket.on('gamePlayerLeft', function(data) {
        alertListeners("gamePlayerLeft", data);
    });

    socket.on("gamePlayerNearBase", function(data) {
        alertListeners("gamePlayerNearBase", data);
    });

    socket.on("gamePlayerChangeHealth", function(data) {
        alertListeners("gamePlayerChangeHealth", data);
    });

    socket.on("gamePlayerDied", function(data) {
        alertListeners("gamePlayerDied", data);
    });

    socket.on("gamePlayerRespawn", function(data) {
        alertListeners("gamePlayerRespawn", data);
    });

    socket.on("gameBaseChangeHealth", function(data) {
        alertListeners("gameBaseChangeHealth", data);
    });

    function alertListeners(eventName, eventData) {
        listenerEventList.forEach(function(listener) {
            if (listener.eventName === eventName) {
                var call = listener.call;
                call(eventData);
            }
        }, this);

        $rootScope.$emit(eventName, eventData);
    }

    // Sends a message over the socket to the server
    // Returns a promise that is fullilled or rejected by the server responce
    function send(eventName, msg) {
        var deferred = $q.defer();

        socket.emit(eventName, msg, function(res) {
            if (res.ok) {
                deferred.resolve(res);
            } else {
                deferred.reject(res);
            }
        });

        return deferred.promise;
    }

    function registerListener(listenerEvent) {
        listenerEventList.push(listenerEvent);
    }


    /* --------------------
         PUBLIC API
     ---------------- */
    return {
        send: send,
        registerListener: registerListener,
        alertListeners: alertListeners
    };

});