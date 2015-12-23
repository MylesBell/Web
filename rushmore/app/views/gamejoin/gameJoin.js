/*
    This controls the first page players see    
    From here they can enter the game code to join a game and move to the player creation screen. 
*/
angular.module('gameJoin', ['ngRoute'])
    .controller('GameJoinCtrl', ['$scope', 'UserService', 'LocationService', function ($scope, UserService, LocationService) {

        // The unique game code for each game
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
        
    }]);