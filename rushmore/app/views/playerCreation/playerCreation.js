/*
   This controls the first page players see    
   Let the player set their username, then move to the game join screen
*/
angular.module('playerCreationView', ['ngRoute'])
    .controller('PlayerCreationCtrl', ['$scope', 'UserService', 'LocationService', function ($scope, UserService, LocationService) {

        // Entered name of the user
        $scope.username = "";
        // Css class showing wether the input name is valid or not
        $scope.validname = false;

        $scope.checkName = function () {
            if ($scope.username === "") {
                console.log("didn't enter a name");
                $scope.validname = false;
            } else if ($scope.username.length > 20) {
                console.log("Too long");
                $scope.validname = false;
            } else {
                $scope.validname = true;
            }
        }

        /* 
            Called when the deploy button selected
                register username to the server over the socket
                move to the main game screen
        */
        $scope.deploy = function () {

            //register with server and send username
            // TODO save user details, perhaps in the user service
            if ($scope.validname) {

                UserService.registerUserWithServer($scope.username)
                    .then(function (res) {
                        console.log(res);
                        LocationService.setPath('/join'); // TODO CHANGE THIS 

                    }).catch(function (res) {

                        // name was not right, show the user the error                
                        $scope.username = res.message;
                        console.log(res);
                    });
            }

        };

    }]);