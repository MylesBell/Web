/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('SpecialPowerManagerService', function($q, $interval) {

    var cooldownTIme = 5000;

    var specialButtonUsed = function(special) {
        var deferred = $q.defer();

        var specialCooldownTimer = $interval(function() {
            var spec = special;
            $interval.cancel(specialCooldownTimer);
            deferred.resolve(spec);
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