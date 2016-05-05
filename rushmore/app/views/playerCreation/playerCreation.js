/*
   This controls the first page players see    
   Let the player set their username, then move to the game join screen
*/
angular.module('playerCreationView', ['ngRoute'])
    .controller('PlayerCreationCtrl', ['$scope', 'UserService', 'LocationService', 'GameInfoService', 'ClassService', function ($scope, UserService, LocationService, GameInfoService, ClassService) {

        // Entered name of the user
        $scope.username = "";
        // Css class showing wether the input name is valid or not
        $scope.validname = false;
        $scope.started = false;

        // Controls whether the to allow user to submit the form
        // Disabled waiting for submit to go through 
        var enableSubmit = true;
        var currentClassSelected = 0;
        $scope.currentClass = "";
        
        // Variables to control the buttons moving around the page
        $scope.titleTranslate = 60;
        $scope.nameFormTranslate = 100;
        $scope.chooseTranslate = 100;
        $scope.headerFontSize = 50;
        $scope.classTranslate = 0;



        ClassService.getClasses().then(function (data) {
            $scope.classes = data;
            $scope.currentClass = $scope.classes[0].name;
        });
        
        var enableFullScreen = false; //SHOULD be TRUE in PROD
        var codeForm = document.getElementById('start-button');
        codeForm.addEventListener("click", fullscreen);

        $scope.start = function () {
            $scope.started = true;
            $scope.titleTranslate = 20;
            $scope.headerFontSize = 40;

            $scope.nameFormTranslate = 0;
            $scope.chooseTranslate = 0;
        };

        // Moves use to the choose class section
        $scope.moveToChooseClass = function () {

        };

        $scope.nextClass = function () {
            if (currentClassSelected < 3) {

                $scope.classTranslate -= 25;
                currentClassSelected += 1;
                $scope.currentClass = $scope.classes[currentClassSelected].name;
            }

        };

        $scope.prevClass = function () {
            if (currentClassSelected > 0) {
                $scope.classTranslate += 25;
                currentClassSelected -= 1;
                $scope.currentClass = $scope.classes[currentClassSelected].name;

            }
        };

        $scope.checkName = function () {
            console.log($scope.username);
            if ($scope.username === "") {
                console.log("Please enter a name");
                $scope.validname = false;
            } else if ($scope.username.length > 20) {
                console.log("Please use a shorter name");
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
            if (enableSubmit) {
                enableSubmit = false;

                //register with server and send username
                if ($scope.validname) {
                    UserService.registerUserWithServer($scope.username)
                        .then(function (res) {
                            console.log(res);
                            LocationService.setPath(res.path);
                        }).catch(function (res) {
                            // name was not right, show the user the error                
                            console.log(res);
                            alert(res.message);
                            enableSubmit = true;
                        });
                }
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