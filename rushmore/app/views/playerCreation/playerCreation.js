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
        $scope.currentClassSelected = 0;
        $scope.currentClass = "";

        // Variables to control the buttons moving around the page
        $scope.titleTranslate = 60;
        $scope.nameFormTranslate = 100;
        $scope.chooseTranslate = 200;
        $scope.headerFontSize = 50;
        $scope.classTranslate = 0;

        ClassService.getClasses().then(function (data) {
            $scope.classes = data;
            $scope.currentClass = $scope.classes[0].name;
        });

        var enableFullScreen = true; //SHOULD be TRUE in PROD
        var codeForm = document.getElementById('start-button');
        codeForm.addEventListener("click", fullscreen);

        $scope.start = function () {
            $scope.started = true;
            $scope.titleTranslate = 20;
            $scope.headerFontSize = 40;

            $scope.nameFormTranslate = 0;
            $scope.chooseTranslate = 100;
        };

        // Check if name correct and Moves use to the choose class section
        $scope.setName = function () {
            if (enableSubmit) {
                enableSubmit = false;
                //register with server and send username
                if ($scope.validname) {
                    $scope.nameFormTranslate = -100;
                    $scope.chooseTranslate = 0;
                }
            }
        };
        
        // Check the name is valid
        $scope.checkName = function () {
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

        // See next class 
        $scope.nextClass = function () {
            if ($scope.currentClassSelected < 3) {
                $scope.classTranslate -= 25;
                $scope.currentClassSelected += 1;
                $scope.currentClass = $scope.classes[$scope.currentClassSelected].name;
            }
        };

        $scope.prevClass = function () {
            if ($scope.currentClassSelected > 0) {
                $scope.classTranslate += 25;
                $scope.currentClassSelected -= 1;
                $scope.currentClass = $scope.classes[$scope.currentClassSelected].name;
            }
        };

        /* 
            Called when the deploy button selected
                register username to the server over the socket
                move to the main game screen
            Useses the currently selected class and sends that to the server
        */
        $scope.deploy = function () {

            //register with server and send username
            UserService.registerUserWithServer($scope.username, $scope.currentClassSelected)
                .then(function (res) {
                    console.log(res);
                    LocationService.setPath(res.path);
                }).catch(function (res) {
                    // name was not right, show the user the error                
                    console.log(res);
                    alert(res.message);
                    enableSubmit = true;
                });
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