/*
   This controls the first page players see    
   Let the player set their username, then move to the game join screen
*/
angular.module('splashView', ['ngRoute'])
    .controller('SplashCtrl', ['$scope', 'LocationService', function ($scope, LocationService) {

        $scope.start = function () {
            LocationService.setPath('/create'); // TODO CHANGE THIS 

        };

    }]);