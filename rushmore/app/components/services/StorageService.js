/*
    Service that provides an interface to the session and local storage
    of the users browser
*/
angular.module('myApp').factory('StorageService', ["$q", "localStorageService", function($q,localStorageService ) {
    
    var get = function(key){
        localStorageService.get(key);
    };
    
    var put = function(key, val) {
        localStorageService.set(key, val);
    };

    return {
        put: put,
        get: get
    };

}]).config(["localStorageServiceProvider", function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('rushmore')
    .setStorageType('sessionStorage')
    .setNotify(true, true);
}]);