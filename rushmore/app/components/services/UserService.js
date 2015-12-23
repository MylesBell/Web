/*
    Service that provides an interface for getting and setting user informaation
    uses NetworkService to communicate with service
*/
angular.module('myApp').factory('UserService', function ($q, NetworkService) {


    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        registerUserWithServer: registerUserWithServer
    };

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