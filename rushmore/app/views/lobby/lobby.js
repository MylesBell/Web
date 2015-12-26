/*
    This controls the first page players see    
    From here they can enter the game code to join a game and move to the player creation screen. 
*/
angular.module('lobbyView', ['ngRoute'])
.controller('LobbyCtrl', ['$scope', 'UserService', 'LocationService', 'GameStateService',
  function($scope, UserService, LocationService, GameStateService) {
    
    /* 
        Called when the deploy button selected
            register username to the server over the socket
            move to the main game screen
    */
    
    $scope.players = [
        {name: "player1", id: 0, team: 1},
        {name: "player2", id: 0, team: 1},
        {name: "player3", id: 0, team: 0},
        {name: "player4", id: 0, team: 0}
    ];

    GameStateService.registerListener({stateName: "playing", call: handleGamePlaying});

    function handleGamePlaying(data){
        console.log("Game playing");
        LocationService.setPath("/game");
    }



}]);