/*
    Page players see when waiting for a game to start
    Shows all the players in the game and what team they are on
*/
angular.module('lobbyView', ['ngRoute'])
.controller('LobbyCtrl', ['$scope', 'UserService', 'LocationService', 'GameStateService',
  function($scope, UserService, LocationService, GameStateService) {
    
    // List of players in the game (updates when players join)   
    $scope.players = [
        {name: "player1", id: 0, team: 1},
        {name: "player2", id: 0, team: 1},
        {name: "player3", id: 0, team: 0},
        {name: "player4", id: 0, team: 0}
    ];

    // When the game playing event occurs, move from the lobby to the game screen
    function handleGamePlaying(data){
        console.log("Game playing");
        LocationService.setPath("/game");
    }

    function updateCurrentPlayerList(data){
        console.log("data");
        $scope.players = data.players;
    }


    /*
        Register for events, when player join the game and when the game starts
    */
    GameStateService.registerListener({stateName: "playing", call: handleGamePlaying});
    // TODO update player list
    

}]);