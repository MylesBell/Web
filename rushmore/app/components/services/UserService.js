/*
    Service that provides an interface for getting and setting user informaation
    uses NetworkService to communicate with service
*/
angular.module('myApp').factory('UserService', function ($q, NetworkService) {


    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        registerUserWithServer: registerUserWithServer,
        attemptToJoinGame: attemptToJoinGame
    };

    function attemptToJoinGame(gamecode) {
        var deferred = $q.defer();

        gamecode = gamecode.trim();
        
        // check name is not too long or short
        if (gamecode.length !== 4) {
            deferred.reject({ ok: false, message: "Gamecodes are  4 characters long" });
        } else {
            
            // try to add the user to the game
            // may need much more validtion and details being sent here
            NetworkService.send("playerJoinGame", {
                gamecode: gamecode
            }).then(function (res) {
                deferred.resolve({ ok: true, details: res.details });
            }).catch(function (err) {
                deferred.reject({ ok: false, message: err.message });
            });
        }

        return deferred.promise;
    }

    /* 
        Sends the users name to the server to register with the game
        Returns a promise resolved when the server responds with game start info
    */
    function registerUserWithServer(username) {

        var deferred = $q.defer();
        
        // trim leading and trailing whitespace
        username = username.trim();
        
        // check name is not too long or short
        if (username.length === 0) {
            deferred.reject({ ok: false, message: "Name must be a least one character long" });
        }
        else if (username.length > 20) {
            deferred.reject({ ok: false, message: "Name must be less than 20 characters" });
        } else {
            // Send the user info to the server to register their name
            // may or may not succeed
            NetworkService.send("playerRegister", {
                username: username
            }).then(function (res) {
                deferred.resolve({ ok: true, username: username });
            }).catch(function (err) {
                // was an error registering the player
                deferred.reject({ ok: false, message: err.message });
            });
        }

        return deferred.promise;
    }

});