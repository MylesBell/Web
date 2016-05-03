/*
   This controls the first page players see    
   Let the player set their username, then move to the game join screen
*/
angular.module('playerCreationView', ['ngRoute'])
    .controller('PlayerCreationCtrl', ['$scope', 'UserService', 'LocationService', 'GameInfoService', function($scope, UserService, LocationService, GameInfoService) {

        // Entered name of the user
        $scope.username = "";
        // Css class showing wether the input name is valid or not
        $scope.validname = false;
        $scope.started = false;
        
        // Variables to control the buttons moving around the page
        $scope.titleTranslate = 60;
        $scope.formTranslate = 100;
        
        var enableFullScreen = false; //SHOULD be TRUE in PROD
        
         var codeForm = document.getElementById('start-button');
        codeForm.addEventListener("click", fullscreen);
        
        $scope.start = function () {
            // LocationService.setPath('/create'); // TODO CHANGE THIS 
            $scope.started = true;
            $scope.titleTranslate = 20;
            $scope.formTranslate = 0;
        };

        $scope.checkName = function () {
            console.log($scope.username);
            if ($scope.username === "") {
                console.log("didn't enter a name");
                $scope.validname = false;
            } else if ($scope.username.length > 20) {
                console.log("Too long");
                $scope.validname = false;
            } else {
                $scope.validname = true;
            }
        };

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
                        LocationService.setPath(res.path);
                    }).catch(function(res) {
                        // name was not right, show the user the error                
                        console.log(res);
                        alert(res.message);
                    });
            }

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