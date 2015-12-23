/*
    This controls the first page players see    
    From here they can enter the game code to join a game and move to the player creation screen. 
*/
angular.module('splashView', ['ngRoute'])
.controller('SplashCtrl', ['$scope', 'UserService', 'LocationService', function($scope, UserService, LocationService) {


    // Entered name of the user
    $scope.username = "Enter your name";
    
    // The unique game code for each game
    $scope.gamecode = "Enter Game Code";
    
    // $scope.joinGame = function() {
    //     GameService.attemptToJoinGame($scope.gamecode).then(function(res){
    //          // the code was was valid and player has joined, 

    //     }).catch(function(res){
    //        // the code was invalid, tell the user that
    //        $scope.gamecode = "Invalid Game Code"; 
    //     });
    // };

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
                LocationService.setPath('/game');
             }).catch(function(res) {
                // name was not right, show the user the error                
                $scope.username = res.message;    
                console.log(res);
            });
    };

}]);