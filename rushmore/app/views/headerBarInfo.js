/*
    This controls the first page players see    
    From here they can enter the game code to join a game and move to the player creation screen. 
*/
angular.module('headerBarInfoView', ['ngRoute'])
    .controller('headerBarInfoCtrl', ['$scope', 'UserService', 'LocationService', "NetworkService", function($scope, UserService, LocationService, NetworkService) {

        // The unique game code for each game
        $scope.username = UserService.getUsername();
        $scope.teamClass = UserService.getUserTeam();
        $scope.hideHeader = false;

        // Get the name when the url changes (so that we update when the user enters their 
        // name on the first screen)
        $scope.$on('$routeChangeStart', function(next, current) {
            $scope.username = UserService.getUsername();

            if ($scope.username === "") {
                $scope.username = "Not Registered";
                console.log("Not registered");
            }
        });

        NetworkService.registerListener({
            eventName: "gamePlayerJoined",
            call: handlePlayerJoinGame
        });

        function handlePlayerJoinGame() {
            $scope.hideHeader = true;
        }

        // Hide the header bar if we're not in the first few pages
        // useful for refreshing on the same page
        if (LocationService.getPath() === "/" || LocationService.getPath() === "/join") {
            $scope.hideHeader = false;
        }

        // TODO make this not shit
        if (LocationService.getPath() === "/tutorial" || LocationService.getPath() === "/lobby" || LocationService.getPath() === "/game") {
            $scope.hideHeader = true;
        }


    }]);