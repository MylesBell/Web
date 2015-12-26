/*
    Service that provides an interface for sending and recieving messages over the network,
    connects to mobile server using socketio client
*/
angular.module('myApp').factory('GameStateService', function ($q, NetworkService) {
   
    var listenerEventList = [];    
    
    function alertListeners(stateName, stateData) {
        listenerEventList.forEach(function (listener) {
            if (listener.stateName === stateName) {
                var call = listener.call;
                call(stateData);
            }
        }, this);
    }

    function registerListener(listenerEvent) {
        listenerEventList.push(listenerEvent);
    }

    
    function handleGameStateUpdate(data) {
        alertListeners(data.state, 0);
    }

    NetworkService.registerListener({eventName: "gameStateUpdate", call: handleGameStateUpdate});

    
   /* --------------------
        PUBLIC API
    ---------------- */
    return {
        registerListener: registerListener
    };
    
});