/*
   This controls the tutorial pages
   Let the player move throough a tutorial section of pages
*/
angular.module('tutorialView', ['ngRoute'])
    .controller('TutorialCtrl', ['$scope', 'ENV', 'UserService', 'LocationService', 'TutorialService', 'GameInfoService', function ($scope, ENV, UserService, LocationService, TutorialService, GameInfoService) {

        $scope.tutorialSteps = 0;
        $scope.currentTutorialIndex = 0;
        $scope.nextText = "NEXT";
        $scope.prevText = "";

        $scope.xTranslate = 0;

        setTeamBackground();

        // Allow skipping the tutorial, onlt possible in dev builds
        var allowSkipping = false;
        if (ENV.name === 'development') {
            allowSkipping = true;
            $scope.prevText = "SKIP";
        }

        // Make the tutorials
        $scope.tutorials = TutorialService.makeTutorial(UserService.getHeroClass(), UserService.getUserTeam(), UserService.getSpecialPowers());
        
        document.getElementById('tutorial-sliding-container').style.width = "600%"
        
        $scope.tutorialSteps = $scope.tutorials.length;
        
        var step = 100 / $scope.tutorialSteps;

        $scope.getStyle = function (tut) {
            var style = {
                background_image: "linear-gradient(to bottom, rgba(255,255,255,0) 50%,rgba(0,0,0,0.6) 100%), url('" + tut.tutorialImage.image + "')",
                background_position_x: tut.tutorialImage.offset_x
            };
            return style;
        };

        $scope.next = function () {
            if ($scope.currentTutorialIndex < $scope.tutorialSteps - 1) {
                $scope.xTranslate -= step;
                $scope.currentTutorialIndex += 1;
            } else {
                LocationService.setPath('/lobby');
            }
            afterMove();            
        };

        $scope.prev = function () {
            if ($scope.currentTutorialIndex > 0) {
                $scope.xTranslate += step;
                $scope.currentTutorialIndex -= 1;
            } else {
                if (allowSkipping) {
                    LocationService.setPath('/lobby');
                }
            }
            afterMove();
        };

        function afterMove() {
            if ($scope.currentTutorialIndex === 0) {
                if (allowSkipping) {
                    $scope.prevText = "SKIP";
                } else {
                    $scope.prevText = "";
                }
            } else if ($scope.currentTutorialIndex === $scope.tutorialSteps - 1) {
                $scope.nextText = "LOBBY";
            } else {
                $scope.prevText = "PREV";
                $scope.nextText = "NEXT";
            }
        }

        // Change the background colour of the container to the teams colours
        function setTeamBackground() {
            var colors = UserService.getTeamColor();
            var tutorialsControlContainer = document.getElementById('tutorial-controls');
            tutorialsControlContainer.style.backgroundColor = colors.dark;

            var team = UserService.getUserTeam();
            if (team === 'red-team') {
                tutorialsControlContainer.style.backgroundImage = "url('../resources/images/backgrounds/red_tut_polybackground.png')";
            } else {
                tutorialsControlContainer.style.backgroundImage = "url('../resources/images/backgrounds/blue_tut_polybackground.png')";
            }
        }

    }]);