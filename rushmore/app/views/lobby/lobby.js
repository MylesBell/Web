/*
    This controls the first page players see    
    From here they can enter the game code to join a game and move to the player creation screen. 
*/
angular.module('lobbyView', ['ngRoute'])
.controller('LobbyCtrl', ['$scope', 'UserService', 'LocationService', function($scope, UserService, LocationService) {


    
    /* 
        Called when the deploy button selected
            register username to the server over the socket
            move to the main game screen
    */
    $scope.deploy = function() {

        //register with server and send username
        UserService.registerUserWithServer($scope.username)
            .then(function(res) {
                console.log(res);
                LocationService.setPath('/join');
             }).catch(function(res) {
                // name was not right, show the user the error                
                $scope.username = res.message; 
                // UserService.setUserDetails(res.details);   
                console.log(res);
            });
    };

}]);