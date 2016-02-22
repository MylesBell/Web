/*
    Page players see when waiting for a game to start
    Shows all the players in the game and what team they are on
*/
angular.module('lobbyView', ['ngRoute'])
    .controller('LobbyCtrl', ['$scope', 'UserService', 'LocationService', 'GameInfoService',
        function($scope, UserService, LocationService, GameInfoService) {

            // List of players in the game (updates when players join)   
            $scope.players = GameInfoService.getPlayerList();
            $scope.showStartButton = true;

            // When the game playing event occurs, move from the lobby to the game screen
            function handleGameStateChange(data) {
                if(data.state === 1){ // 1 is playing
                    LocationService.setPath("/game");
                }
            }

            // Updates the player list when a new player joins
            function updateCurrentPlayerList(data) {
                $scope.players = data.playerList;
            }

            $scope.startGame = function(){
                if(GameInfoService.getState() === 1){
                    LocationService.setPath("/game");
                } else {
                    console.error("Tried joining game but game state wasn't 1 but " + GameInfoService.getState());
                }
            }

            // TODO test this with a real game
            if(GameInfoService.getState() === 1){
                $scope.showStartButton = true;
            }


            /*
                Register for events, when player join the game and when the game starts
            */
            GameInfoService.registerListener({
                stateName: 1,
                call: handleGameStateChange
            });

            GameInfoService.registerListener({
                stateName: "playerJoined",
                call: updateCurrentPlayerList
            });

            GameInfoService.registerListener({
                stateName: "playerLeft",
                call: updateCurrentPlayerList
            });

            // TODO update player list
        }
    ]);