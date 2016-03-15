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

        var enableFullScreen = true; // should be true in production

        var codeForm = document.getElementById('game-code-submit-form');
        codeForm.addEventListener("submit", fullscreen);

        $scope.joinGame = function() {
            UserService.attemptToJoinGame($scope.gamecode).then(function(res) {
                // the code was was valid and sent to the unity server
                // the user has joined move they to either game or lobby

                // MESSING WITH THIS TO GO TO TUTORIAL
                if (res.state === 0) {
                    // LocationService.setPath('/lobby');
                    LocationService.setPath('/tutorial');
                } else if (res.state === 1) {
                    LocationService.setPath('/game');
                } else {
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

        function fullscreen() {
            if (enableFullScreen) {
                var mainContainer = document.getElementById('main-container');
                if (mainContainer.requestFullscreen) {
                    mainContainer.requestFullscreen();
                } else if (mainContainer.msRequestFullscreen) {
                    mainContainer.msRequestFullscreen();
                } else if (mainContainer.mozRequestFullScreen) {
                    mainContainer.mozRequestFullScreen();
                } else if (mainContainer.webkitRequestFullscreen) {
                    mainContainer.webkitRequestFullscreen();
                }
            }

        }

    }]);
