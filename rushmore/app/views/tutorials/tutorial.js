/*
   This controls the tutorial pages
   Let the player move throough a tutorial section of pages
*/
angular.module('tutorialView', ['ngRoute'])
    .controller('TutorialCtrl', ['$scope', 'UserService', 'LocationService', function($scope, UserService, LocationService) {


        $scope.tutorialSteps = 3;
        $scope.currentTutorialIndex = 0;
        $scope.nextText = "NEXT";
        $scope.prevText = "SKIP";

        setTeamBackground();

        // TODO pull this out to a service
        $scope.tutorials = [{
            tutIndex: 0,
            tutorialTitle: "You are a powerful hero",
            tutorialText: "Defeating enemy grunts and heros will make you stronger",
            tutorialImage: "../../resources/images/base_cowboy.png",
            visible: true
        }, {
            tutIndex: 1,
            tutorialTitle: "Destroy the enemy's base to win",
            tutorialText: "Your team's grunts will help to keep the enemy from your gates",
            tutorialImage: "../../resources/images/base_cowboy.png",
            visible: false
        }, {
            tutIndex: 2,
            tutorialText: "Deating ",
            tutorialImage: "../../resources/images/base_cowboy.png",
            visible: false
        }];

        $scope.getStyle = function(tut) {
            var style = {
                background_image: "linear-gradient(to bottom, rgba(255,255,255,0) 70%,rgba(0,0,0,0.6) 100%), url('" + tut.tutorialImage + "')"
            };
            return style;
        };

        $scope.next = function() {

            if ($scope.currentTutorialIndex + 1 < $scope.tutorialSteps) {

                $scope.nextText = "NEXT";
                $scope.prevText = "PREV";

                // animate the current page moving out
                var prevTutPage = document.getElementById("tutorial-" + $scope.currentTutorialIndex);
                prevTutPage.classList.add("tutorial-anim-page-slide-left");

                // when the animation ends, hide the old tutorial page
                prevTutPage.addEventListener("transitionend", function() {
                    $scope.tutorials[$scope.currentTutorialIndex].visible = false;

                    // move to the next tutorial
                    $scope.currentTutorialIndex += 1;
                    $scope.$apply();

                    //Update the navgation text
                    if ($scope.currentTutorialIndex === $scope.tutorialSteps) {
                        // Indicate they can move to the lobby on the last tutorial page
                        $scope.nextText = "TO LOBBY";
                    }

                    if ($scope.currentTutorialIndex === 0) {
                        // allow skipping on the first page
                        $scope.prevText = "SKIP";
                    }
                });

                // animate the next lesson moving in
                var nextTutPage = document.getElementById("tutorial-" + ($scope.currentTutorialIndex + 1));
                // set the next lesson to visible
                $scope.tutorials[$scope.currentTutorialIndex + 1].visible = true;
                nextTutPage.classList.add("tutorial-anim-page-slide-in-left");

            } else {
                // finished tutorial, go to the lobby
                LocationService.setPath('/lobby');
            }
        };

        $scope.prev = function() {
            console.log("prev");
            if ($scope.currentTutorialIndex > 0) {
                // move to the next tutorial
                $scope.currentTutorialIndex -= 1;
                $scope.nextText = "NEXT";

                if ($scope.currentTutorialIndex === 0) {
                    $scope.prevText = "SKIP";
                }
            } else {
                // Can't go back any further, this is the skip button now
                $scope.prevText = "SKIP";

                // skip to the lobby
                LocationService.setPath('/lobby');
            }
        };

        $scope.skip = function() {
            LocationService.setPath('/lobby');
        };

        // Change the background colour of the container to the teams colours
        function setTeamBackground() {
            var colors = UserService.getTeamColor();

            var tutorialsControlContainer = document.getElementById('tutorial-controls');

            tutorialsControlContainer.style.backgroundColor = colors.dark;

        }

    }]);