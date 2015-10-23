/*
    Service that provides an interface for getting and setting user informaation
    uses NetworkService to communicate with service
*/
angular.module('myApp').factory('UserService', function($q, NetworkService) {


    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        registerWithServer: registerWithServer
    };

    /* 
        Sends the users name to the server to register with the game
        Returns a promise resolved when the server responds with game start info
    */
    function registerWithServer(username) {
        var deferred = $q.defer();

        NetworkService.send("user register", {
            username: username
        }, function(res) {
            if (res.ok === false) {
                deferred.reject(res);
            } else {
                deferred.resolve(res);
            }
        });

        return deferred.promise;
    }

});