/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('SpecialPowerManagerService', function($q, $interval) {

    var cooldownTIme = 5000;

    var specialButtonUsed = function() {
        var deferred = $q.defer();

        var specialCooldownTimer = $interval(function() {
            $interval.cancel(specialCooldownTimer);
            deferred.resolve();
        }, cooldownTIme);

        return deferred.promise;
    };

    /* --------------------
         PUBLIC API
     ---------------- */
    return {        
        specialButtonUsed: specialButtonUsed
    };

});