/*
   This controls the first page players see    
   Let the player set their username, then move to the game join screen
*/
angular.module('playerCreationView', ['ngRoute'])
    .controller('PlayerCreationCtrl', ['$scope', 'UserService', 'LocationService', 'GameInfoService', function($scope, UserService, LocationService, GameInfoService) {

        // Entered name of the user
        $scope.username = "Enter your name";
        
        // Whether to go to the code screen
        // If true, will go straight to joining the game        
        var skipCode = true;

        /* 
            Called when the deploy button selected
                register username to the server over the socket
                move to the main game screen
        */
        $scope.deploy = function() {

            //register with server and send username
            // TODO save user details, perhaps in the user service
            if ($scope.username === "Enter your name") {
                console.log("didn't enter a name");
            } else {
                UserService.registerUserWithServer($scope.username, skipCode)
                    .then(function(res) {
                        console.log(res);
                        LocationService.setPath(res.path);
                    }).catch(function(res) {
                        // name was not right, show the user the error                
                        $scope.username = res.message;
                        console.log(res);
                    });
            }

        };

    }]);