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

        // TODO pull this out to a service
        $scope.tutorials = [{
            tutIndex: 0,
            tutorialTitle: "You are a powerful hero",
            tutorialText: "Defeating enemy grunts and heros will make you stronger",
            tutorialImage: "../../resources/images/eye_black.png",
        }, {
            tutIndex: 1,
            tutorialTitle: "Destroy the enemy's base to win",
            tutorialText: "Your team's grunts will help to keep the enemy from your gates",
            tutorialImage: "../../resources/images/eye_black.png",

        }, {
            tutIndex: 2,
            tutorialText: "Deating ",
            tutorialImage: "../../resources/images/eye_black.png",
        }];

        $scope.next = function() {
            if ($scope.currentTutorialIndex + 1 < $scope.tutorialSteps) {
                // move to the next tutorial
                $scope.currentTutorialIndex += 1;
                $scope.nextText = "NEXT";
                $scope.prevText = "PREV";

                // Indicate they can move to the lobby on the last tutorial page
                if ($scope.currentTutorialIndex + 1 === $scope.tutorialSteps) {
                    $scope.nextText = "LOBBY";
                }

                if ($scope.currentTutorialIndex === 0) {
                    $scope.prevText = "SKIP";
                }

            } else {
                // finished tutorial, go to the lobby
                LocationService.setPath('/lobby');
            }
        };

        $scope.prev = function() {
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

    }]);