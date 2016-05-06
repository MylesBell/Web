/*
    Page players see when waiting for a game to start
    Shows all the players in the game and what team they are on
*/
angular.module('myApp')
    .controller('LobbyCtrl', ['$scope', '$rootScope', 'UserService', 'LocationService', 'GameInfoService', 'NetworkService',
        function ($scope, $rootScope, UserService, LocationService, GameInfoService, NetworkService) {

            // List of players in the game (updates when players join)   
            $scope.players = GameInfoService.getPlayerList();
            $scope.showStartButton = true;

            // Should be false for prod
            $scope.canJoin = false;
            $scope.buttonText = "NOT STARTED YET";

            window.scrollTo(0, 1);

            // When the game playing event occurs, move from the lobby to the game screen
            function handleGameStateChange(data) {
                if (data.state === 1) { // 1 is playing
                    $scope.canJoin = true;
                    $scope.buttonText = "CLICK TO JOIN GAME";
                }
            }

            // Updates the player list when a new player joins
            function updateCurrentPlayerList(data) {
                $scope.players = data.playerList;
            }

            $scope.getHeroClassName = function (heroClassNum) {
                if (heroClassNum === 0) {
                    return "HUNTER";
                } else if (heroClassNum === 1) {
                    return "HITMAN";
                } else if (heroClassNum === 2) {
                    return "HEALER";
                } else {
                    return "HARDHAT";
                }
            };

            $scope.startGame = function () {
                if ($scope.canJoin || UserService.getGameState() === 1) {
                    LocationService.setPath("/game");
                } else {
                    console.error("Tried joining game but game state wasn't 1 but " + UserService.getGameState());
                }
            };

            if (UserService.getGameState() === 1 || GameInfoService.getGameState() === 1) {
                $scope.showStartButton = true;
                $scope.canJoin = true;
                $scope.buttonText = "CLICK TO JOIN GAME";
            }

            /*
                Register for events, when player join the game and when the game starts
            */

            // Can also be called on the route scope, currently used only be testing
            $rootScope.$on('gameStateUpdate', function (e, data) {
                handleGameStateChange(data);
            });

            // Register to listen to new players joining
            NetworkService.registerListener({
                eventName: "gamePlayerJoined",
                call: updateCurrentPlayerList
            });

            // Register to listen to players leaving
            NetworkService.registerListener({
                eventName: "gamePlayerLeft",
                call: updateCurrentPlayerList
            });

            // Register to listen to changes in state
            NetworkService.registerListener({
                eventName: "gameStateUpdate",
                call: handleGameStateChange
            });

        }
    ]);
