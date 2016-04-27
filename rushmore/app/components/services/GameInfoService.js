/*
    Service that provides controllers information about the game state such as 
        Current players in the game
*/
angular.module('GameInfoServiceModule', []).factory('GameInfoService', ["$q", "NetworkService", function($q, NetworkService) {

    var listenerEventList = [];
    var playerList = [];
    var gameState = 0;

    // Tell listeners that a player has joined
    function handlePlayerJoinedEvent(data) {
        playerList = data.playerList;
    }

    // Tell listeners that a player has left
    function handlePlayerLeaveEvent(data) {
        playerList = data.playerList;
    }
    
    function handleGameStateUpdate(data){
        gameState = data.state;
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
    
    // Register to listen to players leaving
    NetworkService.registerListener({
        eventName: "gameStateUpdate",
        call: handleGameStateUpdate
    });

    function getPlayerList() {
        return playerList;
    }
    
    function getGameState(){
        return gameState;        
    }


    /* --------------------
         PUBLIC API
     ---------------- */
    return {
        getPlayerList: getPlayerList,
        getGameState: getGameState
    };

}]);