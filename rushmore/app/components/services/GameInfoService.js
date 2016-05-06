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
        stats = data.playersStats;
        console.log(data);
    }

    function getPlayerList() {
        return playerList;
    }

    function getGameState() {
        return gameState;
    }

    function getStats() {
        console.log(stats);
        if (stats) {
            var image_name = "/resources/images/stats/herotypes/";
            // add images to each player in stats
            stats.forEach(function (player) {
                if (player.teamID === 0) {
                    // viking
                    image_name += "viking_";
                } else {
                    image_name += "cowboy_";
                }

                if (player.heroClass === 0) {
                    image_name += "hunter.png";
                } else if (player.heroClass === 1) {
                    image_name += "hitman.png";
                } else if (player.heroClass === 2) {
                    image_name += "healer.png";
                } else {
                    image_name += "hardhat.png";
                }

                player.image = image_name;
            });

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
                teamID: 1,
                image: " /resources/images/stats/herotypes/viking_hunter.png"
            }, {
                    playerID: 1,
                    username: "Dave",
                    deaths: 3,
                    gruntKills: 6,
                    heroKills: 4,
                    towersCaptured: 1,
                    heroClass: 0,
                    teamID: 1,
                    image: " /resources/images/stats/herotypes/cowboy_hitman.png"

                }, {
                    playerID: 2,
                    username: "Madjid",
                    deaths: 0,
                    gruntKills: 5,
                    heroKills: 2,
                    towersCaptured: 2,
                    heroClass: 0,
                    teamID: 1,
                    image: " /resources/images/stats/herotypes/viking_healer.png"
                }];
        }
    }


});