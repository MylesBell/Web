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


            }).catch(function(res) {
                // the code or joining was invalid, tell the user that
                console.log(res);
                $scope.gamecode = res.message;
                $scope.enableInput = true;
            });

            $scope.gamecode = "Joining game...";
            $scope.enableInput = false;
        };

        // Called when the player has successfully joined
        // if this is for THIS player
        //      move to the lobby page or game page if game already running
        //       and set team only
        function playerJoinedEvent(data) {
            if (data.uID === UserService.getUserID()) {

                console.log(data);
                if (data.joinSuccess) {
                    // if game has not started yet
                    if (data.state === 0) {
                        LocationService.setPath('/lobby');
                    } else if (data.state === 1) {
                        LocationService.setPath('/game');
                    } else {
                        console.log("Son you fucked up");
                    }

                    //set team background colour
                    if (data.team === 0) {
                        UserService.setUserTeam('red-team');
                    } else if (data.team === 1) {
                        UserService.setUserTeam('blue-team');
                    }
                } else {
                    $scope.gamecode = "Wrong Code";
                    $scope.enableInput = true;
                }
            }
        }


    }]);