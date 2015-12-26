/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('StorageService', function($q,localStorageService ) {
    
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

}).config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('rushmore')
    .setStorageType('sessionStorage')
    .setNotify(true, true);
});