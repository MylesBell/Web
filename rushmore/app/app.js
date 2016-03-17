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
    "UserServiceModule",
    "GameInfoServiceModule",
    "config",
    "ngIdle",
]).
config(function($routeProvider, IdleProvider, KeepaliveProvider, TitleProvider) {
    // configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(600); // in seconds
    KeepaliveProvider.interval(2); // in seconds
    TitleProvider.enabled(false);

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
}).
run(function(Idle){
    // start watching when the app runs. also starts the Keepalive service by default.
    Idle.watch();
});
