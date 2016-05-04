/*
    Service that provides controllers information about the game state such as 
        Current players in the game
*/
angular.module('GameInfoServiceModule', []).factory('GameInfoService', function ($q, NetworkService) {

    var listenerEventList = [];
    var playerList = [];
    var gameState = 0;
    var stats;

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

    // Register to listen to new players joining
    NetworkService.registerListener({
        eventName: "gamePlayersStats",
        call: handleStats
    });

    /* --------------------
         PUBLIC API
     ---------------- */
    return {
        getPlayerList: getPlayerList,
        getGameState: getGameState,
        getStats: getStats
    };

    // Tell listeners that a player has joined
    function handlePlayerJoinedEvent(data) {
        playerList = data.playerList;
    }

    // Tell listeners that a player has left
    function handlePlayerLeaveEvent(data) {
        playerList = data.playerList;
    }

    function handleGameStateUpdate(data) {
        gameState = data.state;
    }

    function handleStats(data) {
        stats = data;
    }

    function getPlayerList() {
        return playerList;
    }

    function getGameState() {
        return gameState;
    }

    function getStats() {
        if (stats) {
            return stats;
        } else {
            return [{
                playerID: 0,
                username: "Mike",
                deaths: 4,
                gruntKills: 3,
                heroKills: 1,
                towersCaptured: 1,
                heroClass: 0,
                teamID: 1
            }, {
                    playerID: 1,
                    username: "Dave",
                    deaths: 3,
                    gruntKills: 6,
                    heroKills: 4,
                    towersCaptured: 1,
                    heroClass: 0,
                    teamID: 1
                }, {
                    playerID: 2,
                    username: "Madjid",
                    deaths: 0,
                    gruntKills: 5,
                    heroKills: 2,
                    towersCaptured: 2,
                    heroClass: 0,
                    teamID: 1
                }];
        }
    }


});