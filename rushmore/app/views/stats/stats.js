/*
   This controls the first page players see    
   Let the player set their username, then move to the game join screen
*/
angular.module('myApp')
    .controller('StatsCtrl', ['$scope', 'UserService', 'LocationService', 'GameInfoService', function ($scope, UserService, LocationService, GameInfoService) {

        $scope.boardTransform = 0;

        var podiums = 4;
        var currentStep = 0;
        var step = 100 / podiums;

        $scope.next = function () {
            if (currentStep < podiums - 1) {
                console.log("next");

                $scope.boardTransform -= step;
                currentStep += 1;
            }
        }

        $scope.prev = function () {
            if (currentStep > 0) {
                console.log("prev");

                $scope.boardTransform += step;
                currentStep -= 1;
            }
        }

        var podiumsEls = document.querySelectorAll(".podium-container");
        for (var i = 0; i < podiumsEls.length; i++) {
            podiumsEls[i].style.width = (step - 2).toString() + "%";
        }

        var width = (100 * podiums).toString();
        var el = document.getElementById('podiums-container')
        el.style.width = width + "%";

    }]);