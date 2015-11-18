/*
    Service that provides an interface for getting and setting user informaation
    uses NetworkService to communicate with service
*/
angular.module('myApp').factory('InputHandlerService', function($q, NetworkService) {


    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        handleInput: handleInput
    };

    /* 
        Sends the users name to the server to register with the game
        Returns a promise resolved when the server responds with game start info
    */
    function handleInput(input) {
        var deferred = $q.defer();

        NetworkService.send("playerDirection", {
            input: input.direction
        });
        deferred.resolve({ok:true});

        return deferred.promise;
    }

});
