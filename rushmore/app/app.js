// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'gameJoinView',
    'gameView',
    'headerBarInfoView',
    'playerCreationView',
    "lobbyView",
    "tutorialView",
    "btford.socket-io",
    "LocalStorageModule",
    "config"
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'views/game/game.html',
        controller: 'GameCtrl'
    }).when('/join', {
        templateUrl: 'views/gameJoin/gameJoin.html',
        controller: 'GameJoinCtrl'
    }).when('/lobby', {
        templateUrl: 'views/lobby/lobby.html',
        controller: 'LobbyCtrl'
    }).when('/tutorial', {
        templateUrl: 'views/tutorials/tutorial.html',
        controller: 'TutorialCtrl'
    }).when('/', {
        templateUrl: 'views/playerCreation/playerCreation.html',
        controller: 'PlayerCreationCtrl'
    }).otherwise({
        redirectTo: '/'
    });
}]);