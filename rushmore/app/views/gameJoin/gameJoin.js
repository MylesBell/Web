/*
    This page allows players to join a game
    must enter the correct game code TODO CHANGE TO VALIDATE THIS  
    Move to the game lobby after this
*/
angular.module('gameJoinView', ['ngRoute'])
    .controller('GameJoinCtrl', ['$scope', 'UserService', 'LocationService', "NetworkService", "GameInfoService", function($scope, UserService, LocationService, NetworkService, GameInfoService) {

        // The unique game code for each game
        $scope.username = UserService.getUsername();
        $scope.gamecode = "";
        $scope.enableInput = true;

        $scope.joinGame = function() {
            var gameCode = $scope.gamecode.toLowerCase();
            UserService.attemptToJoinGame(gameCode).then(function(res) {
                console.log(res);
                // the code was was valid and sent to the unity server
                // the user has joined move they to either game or lobby

                // MESSING WITH THIS TO GO TO TUTORIAL
                if (res.state === 0 || res.state === 1) {
                    LocationService.setPath('/tutorial');
                } else{
                    console.log("Son you fucked up");
                
                }

            }).catch(function(res) {
                // the code or joining was invalid, tell the user that
                console.log(res);
                $scope.gamecode = res.message;
                $scope.enableInput = true;
            });

            $scope.gamecode = "Joining game...";
            $scope.enableInput = false;
        };

    }]);
