/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('SpecialPowerManagerService', function($q, $interval, InputHandlerService) {

    var vibrateTime = 200;

    var specialButtonUsed = function(special, position) {

        // var special;
        var deferred;
        var cooldownTime;

        deferred = $q.defer();

        console.log(special);

        // Vibrate the phone 
        if (window.navigator.vibrate !== undefined) {
            window.navigator.vibrate(vibrateTime);
        } else {
            // no vibrate, do nothing, sucks for iOS
        }

        // Fire the special event to the server
        InputHandlerService.handleSpecial(position);

        // Set the cooldown time for the special in miliseconds
        cooldownTime = special.cooldownTime * 1000;

        // Set a cooldown timer for the special before it can be used again
        var specialCooldownTimer = $interval(function() {
            // capture special used in closue to allow multple timeouts
            var spec = special;
    
            // Cancel timer and reset special
            $interval.cancel(specialCooldownTimer);
            spec.enabled = true;
            deferred.resolve(spec);

        }, cooldownTime);

        return deferred.promise;
    };

    // Add client game special stuff to specials,
    // Enabled flag and css classes
    var setupSpecials = function(specials) {
        for (var i = 0; i < specials.length; i++) {
            specials[i].enabled = true;
            specials[i].cssName = "special-" + specials[i].type + "-" + specials[i].idea;
        }
        return specials;
    };

    /* --------------------
         PUBLIC API
     ---------------- */
    return {
        specialButtonUsed: specialButtonUsed,
        setupSpecials: setupSpecials
    };

});
