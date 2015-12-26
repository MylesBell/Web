/*
    This controls the first page players see    
    From here they can enter the game code to join a game and move to the player creation screen. 
*/
angular.module('headerBarInfoView', ['ngRoute'])
    .controller('headerBarInfoCtrl', ['$scope', 'UserService', 'LocationService', "NetworkService", function ($scope, UserService, LocationService, NetworkService) {

        // The unique game code for each game
        $scope.username = UserService.getUsername();
        
        // Get the name when the url changes (so that we update when the user enters their 
        // name on the first screen)
        $scope.$on('$routeChangeStart', function (next, current) {
             $scope.username = UserService.getUsername();
        });
        
    }]);