/*
   This controls the tutorial pages
   Let the player move throough a tutorial section of pages
*/
angular.module('tutorialView', ['ngRoute'])
.controller('TutorialCtrl', ['$scope', 'UserService', 'LocationService', function($scope, UserService, LocationService) {


    $scope.tutorialSteps = 3;
    $scope.currentStep = 0;
    
   
    $scope.next = function() {
        console.log("NEXT");

        $scope.currentStep += 1;

        if($scope.currentStep < $scope.tutorialSteps) {
            // move to the next tutorial
        } else {
            // finished tutorial, go to the lobby
            LocationService.setPath('/lobby');
        }
        
    };

    $scope.skip = function() {
        LocationService.setPath('/lobby');
    };

}]);