/*
   This controls the first page players see    
   Let the player set their username, then move to the game join screen
*/
angular.module('myApp')
    .controller('StatsCtrl', ['$scope', 'NetworkService', 'UserService', 'LocationService', 'GameInfoService', function ($scope, NetworkService, UserService, LocationService, GameInfoService) {

        $scope.boardTransform = 0;
        $scope.currentAward = "";

        var podiums = 4;
        $scope.currentStep = 0;
        var step = 100 / podiums;
        $scope.step = step - 5;

        var userStats = GameInfoService.getStats();

        $scope.awards = {
            heroKills: { players: [], description: "Hero Kills" },
            gruntKills: { players: [], description: "Grunts Kills" },
            towersCaptured: { players: [], description: "Tower Captures" },
            deaths: { players: [], description: "Deaths" }
        };

        $scope.currentAward = $scope.awards[Object.keys($scope.awards)[0]].description;

        filterStats();

        // Register to listen to players leaving
        NetworkService.registerListener({
            eventName: "gameStateUpdate",
            call: handleGameStateUpdate
        });


        // Control moving to different leadboard sections
        $scope.next = function () {
            if ($scope.currentStep < podiums - 1) {
                $scope.boardTransform -= step;
                $scope.currentStep += 1;
            }
            $scope.currentAward = $scope.awards[Object.keys($scope.awards)[$scope.currentStep]].description;

        };

        $scope.prev = function () {
            if ($scope.currentStep > 0) {
                $scope.boardTransform += step;
                $scope.currentStep -= 1;
            }
            $scope.currentAward = $scope.awards[Object.keys($scope.awards)[$scope.currentStep]].description;
        };

        // For each metric in the stats, set the top ranked players
        function filterStats() {
            // For each scoring metric rank all the players
            Object.keys($scope.awards).forEach(function (key, index) {
                // Order stats in ascending order
                userStats.sort(function (a, b) {
                    return b[key] - a[key];
                });

                // take the top 3 and get info for podium display
                for (var i = 0; i < 3; i++) {
                    $scope.awards[key].players.push(userStats[i]);
                }

            });
        }

        var width = ((100 * podiums)).toString();
        var el = document.getElementById('podiums-container');
        el.style.width = width + "%";

        // Handle the Game state changing
        // If game starts playing again, go back to the /game page
        function handleGameStateUpdate(data) {
            if (data.state === 1) {
                LocationService.setPath('/game');
            }
        }

    }]);