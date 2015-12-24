// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'gameJoinView',
    'gameView',
    'headerBarInfoView',
    'playerCreationView',
    "btford.socket-io",
    "config"
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'views/game/game.html',
        controller: 'GameCtrl'
    }).when('/', {
        templateUrl: 'views/playerCreation/playerCreation.html',
        controller: 'PlayerCreationCtrl'
    }).when('/join', {
        templateUrl: 'views/gamejoin/gameJoin.html',
        controller: 'GameJoinCtrl'
    }).otherwise({
        redirectTo: '/'
    });
}]);