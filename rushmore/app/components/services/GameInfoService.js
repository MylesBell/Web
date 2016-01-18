/*
    Service that provides controllers information about the game state such as 
        Current players in the game
        The state of the game
        Events occuring in the game state
*/
angular.module('myApp').factory('GameInfoService', function($q, NetworkService) {

    var listenerEventList = [];

    function alertListeners(name, data) {
        listenerEventList.forEach(function(listener) {
            if (listener.stateName === name) {
                var call = listener.call;
                call(data);
            }
        }, this);
    }

    function registerListener(listenerEvent) {
        listenerEventList.push(listenerEvent);
    }


    function handleGameStateUpdate(data) {
        alertListeners(data.state, 0);
    }

    function handlePlayerJoinedEvent (data) {
        alertListeners("playerJoined", data);
    }

    // Register to listen to changes in state
    NetworkService.registerListener({
        eventName: "gameStateUpdate",
        call: handleGameStateUpdate
    });
    NetworkService.registerListener({
        eventName: "gamePlayerJoined",
        call: handlePlayerJoinedEvent
    });

    /* --------------------
         PUBLIC API
     ---------------- */
    return {
        registerListener: registerListener
    };

});