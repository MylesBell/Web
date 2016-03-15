/*
    Service that provides controllers information about the game state such as 
        Current players in the game
*/
angular.module('myApp').factory('GameInfoService', function($q, NetworkService) {

    var listenerEventList = [];
    var playerList = [];

    // Tell listeners that a player has joined
    function handlePlayerJoinedEvent(data) {
        playerList = data.playerList;
    }

    // Tell listeners that a player has left
    function handlePlayerLeaveEvent(data) {
        playerList = data.playerList;
    }

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


    /* --------------------
         PUBLIC API
     ---------------- */
    return {
        getPlayerList: getPlayerList,
    };

});