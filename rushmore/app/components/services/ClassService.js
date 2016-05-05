/*

*/
angular.module('myApp').factory('ClassService', function ($http, $q) {

    var classes = [
        {
            name: "Hunter",
            hatImage: '/resources/images/hats/hunter_circle_small.png',
            powers: [0, 1, 2],
            powerDesc: []
        },
        {
            name: "Hitman",
            hatImage: '/resources/images/hats/hitman_circle_small.png',
            description: "I am a hitman",
            powers: [4, 10, 9],
            powerDesc: []
        },
        {
            name: "Healer",
            hatImage: '/resources/images/hats/healer_circle_small.png',
            powers: [3, 5, 6],
            powerDesc: []
        },
        {
            name: "Hardhat",
            hatImage: '/resources/images/hats/hardhat_circle_small.png',
            powers: [0, 11, 12],
            powerDesc: []
        }
    ];



    function getClasses() {
        var deferred = $q.defer();

        $http.get('/resources/json/specialsList.json').then(function (res) {
            var powerList = res.data.items;

            // Fill out the specials of each class with info
            classes.forEach(function (cl) {
                cl.powers.forEach(function (powerID) {
                    for (var i = 0; i < powerList.length; i++) {
                        if (powerList[i].id === powerID) {
                            cl.powerDesc.push(powerList[i]);
                        }
                    }
                });
            });
            console.log(classes);
            deferred.resolve(classes);
        });

        return deferred.promise;
    }

    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        getClasses: getClasses
    };

});