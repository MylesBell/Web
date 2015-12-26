/*
    Service that provides an interface for getting and setting user informaation
    uses NetworkService to communicate with service
*/
angular.module('myApp').factory('LocationService', function ($q, $location, NetworkService) {



    
    // register for socket events that change the path
    NetworkService.registerListener({ eventName: "locationChange", call: setPath });

    /* 
        Sets the url path
    */
    function setPath(path) {
        console.log(path);
        $location.path(path);
    }
    
   /* --------------------
        PUBLIC API
    ---------------- */

    return {
        setPath: setPath
    };

});