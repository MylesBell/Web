/*
    Page players see when waiting for a game to start
    Shows all the players in the game and what team they are on
*/
angular.module('lobbyView', ['ngRoute'])
    .controller('LobbyCtrl', ['$scope', 'UserService', 'LocationService', 'GameInfoService', 'NetworkService',
        function($scope, UserService, LocationService, GameInfoService, NetworkService) {

            // List of players in the game (updates when players join)   
            $scope.players = GameInfoService.getPlayerList();
            $scope.showStartButton = true;

            // Should be false for prod
            $scope.canJoin = false;
            $scope.buttonText = "NOT STARTED YET";

            // When the game playing event occurs, move from the lobby to the game screen
            function handleGameStateChange(data) {
                console.log("Game state chnaged %o", data);
                if (data.state === 1) { // 1 is playing
                    // LocationService.setPath("/game");
                    $scope.canJoin = true;
                    $scope.buttonText = "CLICK TO JOIN GAME";
                }
            }

            // Updates the player list when a new player joins
            function updateCurrentPlayerList(data) {
                $scope.players = data.playerList;
            }

            $scope.startGame = function() {
                if ($scope.canJoin === 1) {
                    LocationService.setPath("/game");
                } else {
                    console.error("Tried joining game but game state wasn't 1 but " + UserService.getGameState());
                }
            };

            if (UserService.getGameState() === 1) {
                $scope.showStartButton = true;
                $scope.canJoin = true;
                $scope.buttonText = "CLICK TO JOIN GAME";
            }

            /*
                Register for events, when player join the game and when the game starts
            */

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
