/*
    Page players see when waiting for a game to start
    Shows all the players in the game and what team they are on
*/
angular.module('lobbyView', ['ngRoute'])
    .controller('LobbyCtrl', ['$scope', 'UserService', 'LocationService', 'GameInfoService',
        function($scope, UserService, LocationService, GameInfoService) {

            // List of players in the game (updates when players join)   
            $scope.players = GameInfoService.getPlayerList();

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