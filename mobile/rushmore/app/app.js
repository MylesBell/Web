// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'splashView',
    'gameView',
    "btford.socket-io"
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/game', {
        templateUrl: 'views/game/game.html',
        controller: 'GameCtrl'
    }).when('/splash', {
        templateUrl: 'views/splash/splash.html',
        controller: 'SplashCtrl'
    }).otherwise({
        redirectTo: '/splash'
    });
}]);