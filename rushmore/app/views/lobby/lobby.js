/*
    Page players see when waiting for a game to start
    Shows all the players in the game and what team they are on
*/
angular.module('lobbyView', ['ngRoute'])
    .controller('LobbyCtrl', ['$scope', 'UserService', 'LocationService', 'GameInfoService',
        function($scope, UserService, LocationService, GameInfoService) {

            // List of players in the game (updates when players join)   
            $scope.players = [{
                name: "player1",
                id: 0,
                team: 1
            }, {
                name: "player2",
                id: 0,
                team: 1
            }, {
                name: "player3",
                id: 0,
                team: 0
            }, {
                name: "player4",
                id: 0,
                team: 0
            }];

            // When the game playing event occurs, move from the lobby to the game screen
            function handleGamePlaying(data) {
                console.log("Game playing");
                LocationService.setPath("/game");
            }

            function updateCurrentPlayerList(data) {
                console.log("Another player Joined");
                console.log(data);
                $scope.players.push(data);
            }


            /*
                Register for events, when player join the game and when the game starts
            */
            GameInfoService.registerListener({
                stateName: "playing",
                call: handleGamePlaying
            });
            GameInfoService.registerListener({
                stateName: "playerJoined",
                call: updateCurrentPlayerList
            });

            // TODO update player list
        }
    ]);