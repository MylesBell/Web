// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'gameJoinView',
    'gameView',
    'headerBarInfoView',
    'playerCreationView',
    "tutorialView",
    "btford.socket-io",
    "LocalStorageModule",
    "UserServiceModule",
    "GameInfoServiceModule",
    "config",
    'ngIdle',
    "toastr"
    ]).
config(function($routeProvider, IdleProvider, KeepaliveProvider, TitleProvider, toastrConfig) {
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
    }).when('/stats', {
        templateUrl: 'views/stats/stats.html',
        controller: 'StatsCtrl'
    }).when('/', {
        templateUrl: 'views/playerCreation/playerCreation.html',
        controller: 'PlayerCreationCtrl'
    }).otherwise({
        redirectTo: '/'
    });

    angular.extend(toastrConfig, {
        allowHtml: false,
        closeButton: true,
        closeHtml: '<button>&times;</button>',
        extendedTimeOut: 1000,
        iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        onHidden: null,
        onShown: null,
        onTap: null,
        progressBar: true,
        tapToDismiss: true,
        templates: {
            toast: 'directives/toast/toast.html',
            progressbar: 'directives/progressbar/progressbar.html'
        },
        timeOut: 4000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });
}).
run(function(Idle) {
    // start watching when the app runs. also starts the Keepalive service by default.
    Idle.watch();
});
