/*
    Service that provides controllers information about the game state such as 
        Current players in the game
        The state of the game
        Events occuring in the game state
*/
angular.module('myApp').factory('GameInfoService', function($q, NetworkService) {

    var listenerEventList = [];
    var playerList = [];

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

    // Tell listeners that the game state has changed
    function handleGameStateUpdate(data) {
        alertListeners(data.state, data); // name and data are the same for the states
    }

    // Tell listeners that a player has joined
    function handlePlayerJoinedEvent(data) {
        playerList = data.playerList;
        alertListeners("playerJoined", data);
    }

    // Register to listen to changes in state
    NetworkService.registerListener({
        eventName: "gameStateUpdate",
        call: handleGameStateUpdate
    });
    // Register to listen to new players joining
    NetworkService.registerListener({
        eventName: "gamePlayerJoined",
        call: handlePlayerJoinedEvent
    });


    function getPlayerList() {
        return playerList;
    }

    /* --------------------
         PUBLIC API
     ---------------- */
    return {
        registerListener: registerListener,
        getPlayerList: getPlayerList
    };

});