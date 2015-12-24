/*
    This controls the first page players see    
    From here they can enter the game code to join a game and move to the player creation screen. 
*/
angular.module('gameJoinView', ['ngRoute'])
    .controller('GameJoinCtrl', ['$scope', 'UserService', 'LocationService', "NetworkService", function ($scope, UserService, LocationService, NetworkService) {

        // The unique game code for each game
        $scope.username = UserService.getUsername();
        $scope.gamecode = "Enter Game Code";
        $scope.enableInput = true;

        $scope.joinGame = function () {
            UserService.attemptToJoinGame($scope.gamecode).then(function (res) {
                // the code was was valid and sent to the unity server
                // However the user HAS NOT YET joined, until the unity server confirms this
                $scope.gamecode = "Attempting to join game...";
                $scope.enableInput = false;

            }).catch(function (res) {
                // the code or joining was invalid, tell the user that
                $scope.gamecode = res.message;
            });
        };



    
        /*
            Register with the network service to listen to  when the player has joined the game
        */
        NetworkService.registerListener({ eventName: "gamePlayerJoined", call: playerJoinedEvent });

        function playerJoinedEvent(data) {
            if (data.team === 0) {
                UserService.setUserTeam('red-team');
                console.log("RED TEAM");
            } else if (data.team === 1) {
                UserService.setUserTeam('blue-team');
                console.log("BLUE TEAM");
            }
            
            // Move player to the game screen
            LocationService.setPath('/game');
        }

    }]);