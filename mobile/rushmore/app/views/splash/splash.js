'use strict';

angular.module('splashView', ['ngRoute'])


.controller('SplashCtrl', ['$scope', 'UserService', 'LocationService', function($scope, UserService, LocationService) {


    // Entered name of the user
    $scope.username = "Enter your name";

    /* 
        Called when the deploy button selected
            register username to the server over the socket
            move to the main game screen
    */
    $scope.deploy = function() {

        //regsitser with server and send username
        UserService.registerWithServer($scope.username)
            .then(function(res) {
                console.log(res);
            }).then(function() {
                LocationService.setPath('/game');
            }).catch(function(res) {
                console.log(res);
            })
    }

}]);