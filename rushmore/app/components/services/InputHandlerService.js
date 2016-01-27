/*
    Service that handles input from the game screen to the network manager
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
        var eventName = "";

        // handle switches different 
        if(input.direction === "switch") {
            eventName = "playerSwitchBase";
        } else {
            eventName = "playerDirection";
        }

        NetworkService.send(eventName, {
            input: input.direction
        });
        deferred.resolve({ok:true});

        return deferred.promise;
    }

});
