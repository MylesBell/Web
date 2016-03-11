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
            numLessons: 3,
            tutIndex: 0,
            lessons: [{
                lessonIndex: 0,
                lessonText: "You control a powerful hero",
                lessonImage: "../../resources/images/eye_black.png",
                alignLeft: true
            }, {
                lessonIndex: 1,
                lessonText: "Destroy the enemy base to win",
                lessonImage: "../../resources/images/eye_black.png",
                alignLeft: false
            }, {
                lessonIndex: 2,
                lessonText: "Stop your base from being destroyed",
                lessonImage: "../../resources/images/heart_black.png",
                alignLeft: true
            }]
        }, {
            numLessons: 3,
            tutIndex: 1,
            lessons: [{
                lessonIndex: 1,
                lessonText: "You will auto-attack nearby enemies",
                lessonImage: "../../resources/images/eye_black.png",
                alignLeft: false
            }, {
                lessonIndex: 2,
                lessonText: "Activate special abilites to help you in battle",
                lessonImage: "../../resources/images/eye_purple.png",
                alignLeft: true
            }, {
                lessonIndex: 2,
                lessonText: "Defeating grunts increases your power",
                lessonImage: "../../resources/images/heart_green.png",
                alignLeft: false
            }]
        }, {
            numLessons: 3,
            tutIndex: 2,
            lessons: [{
                lessonIndex: 0,
                lessonText: "Deating ",
                lessonImage: "../../resources/images/eye_black.png",
                alignLeft: true
            }, {
                lessonIndex: 1,
                lessonText: "You are a powerful hero",
                lessonImage: "../../resources/images/flame_red.png",
                alignLeft: false
            }, {
                lessonIndex: 2,
                lessonText: "The key to success is the key",
                lessonImage: "../../resources/images/eye_black.png",
                alignLeft: true
            }]
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