/*
   This controls the tutorial pages
   Let the player move throough a tutorial section of pages
*/
angular.module('tutorialView', ['ngRoute'])
    .controller('TutorialCtrl', ['$scope', 'UserService', 'LocationService', function($scope, UserService, LocationService) {


        $scope.tutorialSteps = 3;
        $scope.currentTutorialIndex = 0;
        $scope.nextText = "NEXT";

        $scope.tutorials = [{
            numLessons: 3,
            tutIndex: 0,
            lessons: [{
                lessonIndex: 0,
                lessonText: "You are a powerful hero",
                lessonImage: "../../resources/images/eye_black.png"
            }, {
                lessonIndex: 1,
                lessonText: "Destroy the enemy base to win",
                lessonImage: "../../resources/images/eye_black.png"
            }, {
                lessonIndex: 2,
                lessonText: "Kill enemy grunts to increase your power",
                lessonImage: "../../resources/images/heart_green.png"
            }]
        },{
            numLessons: 3,
            tutIndex: 1,
            lessons: [{
                lessonIndex: 0,
                lessonText: "FUCKING GAY BOY",
                lessonImage: "../../resources/images/heart_black.png"
            }, {
                lessonIndex: 1,
                lessonText: "You are a powerful hero",
                lessonImage: "../../resources/images/eye_black.png"
            }, {
                lessonIndex: 2,
                lessonText: "I'M A STINKY POOP",
                lessonImage: "../../resources/images/eye_purple.png"
            }]
        },{
            numLessons: 3,
            tutIndex: 2,
            lessons: [{
                lessonIndex: 0,
                lessonText: "ANOTHER ONE",
                lessonImage: "../../resources/images/eye_black.png"
            }, {
                lessonIndex: 1,
                lessonText: "You are a powerful hero",
                lessonImage: "../../resources/images/flame_red.png"
            }, {
                lessonIndex: 2,
                lessonText: "The key to success is the key",
                lessonImage: "../../resources/images/eye_black.png"
            }]
        }];

        $scope.next = function() {
            if ($scope.currentTutorialIndex + 1 < $scope.tutorialSteps) {
                // move to the next tutorial
                $scope.currentTutorialIndex += 1;
                $scope.nextText = "NEXT";

                // Indicate they can move to the lobby on the last tutorial page
                if($scope.currentTutorialIndex + 1 === $scope.tutorialSteps) {
                    $scope.nextText = "LOBBY";
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
            } else {
                // Can't go back any further 
            }
        };

        $scope.skip = function() {
            LocationService.setPath('/lobby');
        };

    }]);