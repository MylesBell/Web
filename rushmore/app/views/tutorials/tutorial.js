/*
   This controls the tutorial pages
   Let the player move throough a tutorial section of pages
*/
angular.module('tutorialView', ['ngRoute'])
    .controller('TutorialCtrl', ['$scope', 'ENV', 'UserService', 'LocationService', 'TutorialService', 'GameInfoService', function ($scope, ENV, UserService, LocationService, TutorialService, GameInfoService) {

        $scope.tutorialSteps = 4;
        $scope.currentTutorialIndex = 0;
        $scope.nextText = "NEXT";
        $scope.prevText = "";

        setTeamBackground();

        // Allow skipping the tutorial, onlt possible in dev builds
        var allowSkipping = false;
        if (ENV.name === 'development') {
            allowSkipping = true;
            $scope.prevText = "SKIP";
        }

        // Make the tutorials
        $scope.tutorials = TutorialService.makeTutorial(UserService.getHeroClass(), UserService.getUserTeam(), UserService.getSpecialPowers());

        $scope.getStyle = function (tut) {
            var style = {
                background_image: "linear-gradient(to bottom, rgba(255,255,255,0) 50%,rgba(0,0,0,0.6) 100%), url('" + tut.tutorialImage.image + "')",
                background_position_x: tut.tutorialImage.offset_x
            };
            return style;
        };

        $scope.next = function () {
            if ($scope.currentTutorialIndex + 1 < $scope.tutorials.length) {

                $scope.nextText = "NEXT";
                $scope.prevText = "PREV";

                // animate the current page moving out
                var prevTutPage = document.getElementById("tutorial-" + $scope.currentTutorialIndex);
                prevTutPage.classList.add("tutorial-anim-page-slide-left");

                // when the animation ends, hide the old tutorial page
                prevTutPage.addEventListener("transitionend", afterNextTransition);

                // animate the next lesson moving in
                var nextTutPage = document.getElementById("tutorial-" + ($scope.currentTutorialIndex + 1));
                // set the next lesson to visible
                $scope.tutorials[$scope.currentTutorialIndex + 1].visible = true;
                nextTutPage.classList.add("tutorial-anim-page-slide-in-left");
                nextTutPage.addEventListener("animationend", function () {
                    nextTutPage.classList.remove("tutorial-anim-page-slide-in-left");
                });

            } else {
                // finished tutorial, go to the lobby
                LocationService.setPath('/lobby');
            }
        };

        function afterNextTransition() {
            var prevTutPage = document.getElementById("tutorial-" + $scope.currentTutorialIndex);
            prevTutPage.removeEventListener("transitionend", afterNextTransition);
            prevTutPage.classList.remove("tutorial-anim-page-slide-left");

            $scope.tutorials[$scope.currentTutorialIndex].visible = false;
            // move to the next tutorial
            $scope.currentTutorialIndex += 1;

            //Update the navgation text
            if ($scope.currentTutorialIndex + 1 === $scope.tutorials.length) {
                // Indicate they can move to the lobby on the last tutorial page
                $scope.nextText = "TO LOBBY";
            }
            $scope.$apply();
        }

        function afterPrevTransition() {
            var prevTutPage = document.getElementById("tutorial-" + $scope.currentTutorialIndex);
            prevTutPage.removeEventListener("transitionend", afterPrevTransition);
            prevTutPage.classList.remove("tutorial-anim-page-slide-right");

            $scope.tutorials[$scope.currentTutorialIndex].visible = false;
            // move to the next tutorial
            $scope.currentTutorialIndex -= 1;

            if ($scope.currentTutorialIndex === 0 && allowSkipping) {
                // allow skipping on the first page
                $scope.prevText = "SKIP";
            }
            $scope.$apply();
        }

        $scope.prev = function () {
            if ($scope.currentTutorialIndex > 0) {
                // move to the next tutorial

                $scope.nextText = "NEXT";

                // animate the current page moving out
                var prevTutPage = document.getElementById("tutorial-" + $scope.currentTutorialIndex);
                prevTutPage.classList.add("tutorial-anim-page-slide-right");

                // when the animation ends, hide the old tutorial page
                prevTutPage.addEventListener("transitionend", afterPrevTransition);

                // animate the next lesson moving in
                var nextTutPage = document.getElementById("tutorial-" + ($scope.currentTutorialIndex - 1));
                $scope.tutorials[$scope.currentTutorialIndex - 1].visible = true;

                // set the next lesson to visible
                nextTutPage.classList.add("tutorial-anim-page-slide-in-right");
                nextTutPage.addEventListener("animationend", function () {
                    nextTutPage.classList.remove("tutorial-anim-page-slide-in-right");
                });

            } else {
                // skip to the lobby
                if(allowSkipping){
                    LocationService.setPath('/lobby');
                }
            }
        };

        // Change the background colour of the container to the teams colours
        function setTeamBackground() {
            var colors = UserService.getTeamColor();
            var tutorialsControlContainer = document.getElementById('tutorial-controls');
            tutorialsControlContainer.style.backgroundColor = colors.dark;
        }

    }]);