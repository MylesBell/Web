/*
   This controls the tutorial pages
   Let the player move throough a tutorial section of pages
*/
angular.module('tutorialView', ['ngRoute'])
    .controller('TutorialCtrl', ['$scope', 'UserService', 'LocationService', function($scope, UserService, LocationService) {

        $scope.tutorialSteps = 5;
        $scope.currentTutorialIndex = 0;
        $scope.nextText = "NEXT";
        $scope.prevText = "SKIP";

        var specialTutorial = [];

        setupSpecialTutorial();
        setTeamBackground();

        // TODO pull this out to a service
        $scope.tutorials = [{
            tutIndex: 0,
            tutType: "single",
            tutorialTitle: "Vikings and Cowboys are locked in endless war",
            tutorialText: "As a hero, fight alongside your allies to destroy the COWBOYS",
            tutorialImage: {
                image: "../../resources/images/tutorial/base_cowboy_blur.png",
                offset_x: "50%"
            },
            visible: true
        }, {
            tutIndex: 1,
            tutType: "single",
            tutorialTitle: "Destroy the enemy's base to win",
            tutorialText: "Heros and grunts continiously spawn from each team's base",
            tutorialImage: {
                image: "../../resources/images/tutorial/grunts_blue_base_behind_blur.png",
                offset_x: "80%"
            },
            visible: false
        }, {
            tutIndex: 2,
            tutType: "single",
            tutorialTitle: "Use your special powers to help in combat",
            tutorialText: "Defeating enemy grunts and heros will make you and your powers stronger",
            tutorialImage: {
                image: "../../resources/images/tutorial/grunt_red_base_behind_blur.png",
                offset_x: "50%"
            },
            visible: false
        }, {
            tutIndex: 3,
            tutType: "multi",
            tutorialTitle: "Another tutorial side here",
            miniLessons: specialTutorial,
            tutorialImage: {
                image: "../../resources/images/tutorial/grunts_blue_base_behind_blur.png",
                offset_x: "80%"
            },
            visible: false
        }];

        $scope.tutorialSteps = $scope.tutorials.length;


        function setupSpecialTutorial(){
            var specials = UserService.getSpecialPowers();

            for(var i = 0; i < specials.length; i++){
                var spec = specials[i];
                var lesson = {};
                lesson.text = spec.name;
                lesson.image = "../resources/" + spec.image;
                lesson.description = spec.description;
                specialTutorial.push(lesson);
            }
        }


        $scope.getStyle = function(tut) {
            var style = {
                background_image: "linear-gradient(to bottom, rgba(255,255,255,0) 50%,rgba(0,0,0,0.6) 100%), url('" + tut.tutorialImage.image + "')",
                background_position_x: tut.tutorialImage.offset_x
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
                prevTutPage.addEventListener("transitionend", afterNextTransition);

                // animate the next lesson moving in
                var nextTutPage = document.getElementById("tutorial-" + ($scope.currentTutorialIndex + 1));
                // set the next lesson to visible
                $scope.tutorials[$scope.currentTutorialIndex + 1].visible = true;
                nextTutPage.classList.add("tutorial-anim-page-slide-in-left");
                nextTutPage.addEventListener("animationend", function() {
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
            if ($scope.currentTutorialIndex + 1 === $scope.tutorialSteps) {
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

            if ($scope.currentTutorialIndex === 0) {
                // allow skipping on the first page
                $scope.prevText = "SKIP";
            }
            $scope.$apply();
        }

        $scope.prev = function() {
            console.log("prev");
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
                nextTutPage.addEventListener("animationend", function() {
                    nextTutPage.classList.remove("tutorial-anim-page-slide-in-right");
                });

            } else {
                // skip to the lobby
                LocationService.setPath('/lobby');
            }
        };

        // Change the background colour of the container to the teams colours
        function setTeamBackground() {
            var colors = UserService.getTeamColor();
            var tutorialsControlContainer = document.getElementById('tutorial-controls');
            tutorialsControlContainer.style.backgroundColor = colors.dark;
        }

    }]);