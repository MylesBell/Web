/*
    This page allows players to join a game
    must enter the correct game code TODO CHANGE TO VALIDATE THIS  
    Move to the game lobby after this
*/
angular.module('gameJoinView', ['ngRoute'])
    .controller('GameJoinCtrl', ['$scope', 'UserService', 'LocationService', "NetworkService", "GameInfoService", function($scope, UserService, LocationService, NetworkService, GameInfoService) {

        // The unique game code for each game
        $scope.username = UserService.getUsername();
        $scope.gamecode = "Enter Game Code";
        $scope.enableInput = true;

        $scope.joinGame = function() {
            UserService.attemptToJoinGame($scope.gamecode).then(function(res) {
                // the code was was valid and sent to the unity server
                // However the user HAS NOT YET joined, until the unity server confirms this
                $scope.gamecode = "Joining game...";
                $scope.enableInput = false;

            }).catch(function(res) {
                // the code or joining was invalid, tell the user that
                $scope.gamecode = res.message;
            });
        };

        // Called when the player has successfully joined
        // move to the lobby page and set team
        // only if this is for THIS player
        function playerJoinedEvent(data) {
            if (data.uID === UserService.getUserID()) {
                if (data.team === 0) {
                    UserService.setUserTeam('red-team');
                } else if (data.team === 1) {
                    UserService.setUserTeam('blue-team');
                }
                // Move player to the game screen
                LocationService.setPath('/lobby');
            }
        }
        /*
            Register with the network service to listen to  when the player has joined the game
        */
        NetworkService.registerListener({
            eventName: "gamePlayerJoined",
            call: playerJoinedEvent
        });

    }]);