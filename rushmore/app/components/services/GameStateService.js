/*
    Service that provides controllers information about the game state such as 
        Current players in the game
        The state of the game
        Events occuring in the game state
*/
angular.module('myApp').factory('GameStateService', function ($q, NetworkService) {
   
    var listenerEventList = [];    
    
    function alertListeners(stateName, stateData) {
        listenerEventList.forEach(function (listener) {
            if (listener.stateName === stateName) {
                var call = listener.call;
                call(stateData);
            }
        }, this);
    }

    function registerListener(listenerEvent) {
        listenerEventList.push(listenerEvent);
    }

    
    function handleGameStateUpdate(data) {
        alertListeners(data.state, 0);
    }

    // Register to listen to changes in state
    NetworkService.registerListener({eventName: "gameStateUpdate", call: handleGameStateUpdate});

    
   /* --------------------
        PUBLIC API
    ---------------- */
    return {
        registerListener: registerListener
    };
    
});