/*
    Service that handles movement between pages
*/
angular.module('myApp').factory('LocationService', ["$q", "$rootScope", "$location", "NetworkService", function ($q, $rootScope, $location, NetworkService) {


    $rootScope.$on("$locationChangeStart",function(event, next, current){
        // Don't let them screw up by pressing back if they're in the game
        // PUT THIS BACK IN 
        
        // if(current.indexOf("#/game") > -1){
        //     event.preventDefault();
        // }
    });
    
    // register for socket events that change the path
    NetworkService.registerListener({ eventName: "locationChange", call: setPath });

    /* 
        Sets the url path
    */
    function setPath(path) {
        console.log(path);
        $location.path(path);
    }

    function getPath() {
        return $location.url();
    }
    
   /* --------------------
        PUBLIC API
    ---------------- */

    return {
        setPath: setPath,
        getPath: getPath
    };

}]);