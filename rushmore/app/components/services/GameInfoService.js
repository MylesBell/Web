/*
    Service that provides controllers information about the game state such as 
        Current players in the game
        The state of the game
        Events occuring in the game state
*/
angular.module('myApp').factory('GameInfoService', function($q, NetworkService) {

    var state = 0;
    var listenerEventList = [];
    var playerList = [];

    // Tell listeners that the game state has changed
    function handleGameStateUpdate(data) {
        console.log("Game state  updated %o", data);
        state = data.state;
        alertListeners(data.state, data); // name and data are the same for the states
    }

    // Tell listeners that a player has joined
    function handlePlayerJoinedEvent(data) {
        playerList = data.playerList;
        alertListeners("playerJoined", data);
    }

    // Tell listeners that a player has left
    function handlePlayerLeaveEvent(data) {
        playerList = data.playerList;
        alertListeners("playerLeft", data);
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

    // Register to listen to players leaving
    NetworkService.registerListener({
        eventName: "gamePlayerLeft",
        call: handlePlayerLeaveEvent
    });


    function getPlayerList() {
        return playerList;
    }

    function getState() {
        return state;
    }

    /* --------------------
         PUBLIC API
     ---------------- */
    return {
        registerListener: registerListener,
        getPlayerList: getPlayerList,
        getState: getState
    };

});