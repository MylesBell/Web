/*
    Service that provides an interface for getting and setting user informaation
    uses NetworkService to communicate with service
*/
angular.module('myApp').factory('LocationService', function($q, $location) {


    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        setPath: setPath
    };

    /* 
        Sets the url path
    */
    function setPath(path) {
        console.log(path);
        $location.path('/game');
    }

});