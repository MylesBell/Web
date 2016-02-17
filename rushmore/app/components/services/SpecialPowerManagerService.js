/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('SpecialPowerManagerService', function($q, $interval) {

    var cooldownTIme = 5000;
    var vibrateTime = 200;

    var specialButtonUsed = function(special) {
        var deferred = $q.defer();

        // Get the vibrate api if it exists, else make the function false
        var vibrate = window.navigator.vibrate || false;

        if (vibrate) {
            vibrate(vibrateTime);
        } else {
            // no vibrate, do nothing, sucks for iOS
        }

        special.enabled = "special-disabled";

        var specialCooldownTimer = $interval(function() {
            // capture special used in closue to allow multple timeouts
            var spec = special;

            // Cancle timer and reset special
            $interval.cancel(specialCooldownTimer);
            spec.enabled = "";
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