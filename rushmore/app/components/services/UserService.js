/*
    Service that contains the user information and handles user interaction events such as
    Registering user with server
    Set username for game
*/
angular.module('myApp').factory('UserService', function($q, NetworkService, LocationService) {

    var uID = "";
    var userTeam = "";
    var username = "";
    var joinPromise;
    var specialPowers = {};

    var colors = {
        blue: {
            dark: "#3A539B", // chambray
            primary: "#446CB3", // san marino
            highlight: "#59ABE3", // Picton Blue
            light: "#C5EFF7", // Humming bird
            health: {
                player: {
                    remaining: "#87D37C", // gossip
                    lost: "#90C695" // Dark sea grenn
                },
                base: {
                    lost: "#C5EFF7", // Humming bird
                    remaining: "#59ABE3", // Picton Blue
                }
            }
        },
        red: {
            dark: "#96281B", //old brick
            primary: "#D91E18", // thunderbrid
            highlight: "#E74C3C", //cinnabar
            health: {
                player: {
                    remaining: "#87D37C", // gossip
                    lost: "#90C695" // Dark sea grenn
                },
                base: {
                    lost: "#C5EFF7", // Humming bird
                    remaining: "#E74C3C", //cinnabar
                }
            }
        },

    };

    // set to an inital value, changed when the user is assigned a team
    var teamColors = colors.blue;

    function alertListeners(eventName, eventData) {
        listenerEventList.forEach(function(listener) {
            if (listener.eventName === eventName) {
                var call = listener.call;
                call(eventData);
            }
        }, this);
    }

    function registerListener(listenerEvent) {
        listenerEventList.push(listenerEvent);
    }


    function attemptToJoinGame(gamecode) {
        joinPromise = $q.defer();

        gamecode = gamecode.trim();

        // check name is not too long or short
        if (gamecode.length !== 4) {
            joinPromise.reject({
                ok: false,
                message: "Gamecodes should be 4 characters long"
            });
        } else {

            // try to add the user to the game
            // may need much more validtion and details being sent here
            NetworkService.send("playerJoinGame", {
                gamecode: gamecode,
                username: username
            }).catch(function(err) {
                joinPromise.reject({
                    ok: false,
                    message: err.message
                });
            });
        }

        return joinPromise.promise;
    }

    /* 
        Sends the users name to the server to register with the game
        Returns a promise resolved when the server responds with game start info
        
        If successful, save the userid in the local storage TODO
    */
    function registerUserWithServer(name) {

        var deferred = $q.defer();

        // trim leading and trailing whitespace
        name = name.trim();

        // check name is not too long or short
        if (name.length === 0) {
            deferred.reject({
                ok: false,
                message: "Too Short"
            });
        } else if (name.length > 20) {
            deferred.reject({
                ok: false,
                message: "Too Long"
            });
        } else {
            // Send the user info to the server to register their name
            // may or may not succeed
            NetworkService.send("playerRegister", {
                username: name
            }).then(function(res) {
                username = name;
                uID = res.uID;
                deferred.resolve({
                    ok: true,
                    username: name
                });
            }).catch(function(err) {
                // was an error registering the player
                deferred.reject({
                    ok: false,
                    message: err.message
                });
            });
        }

        return deferred.promise;
    }

    // Called when the player has successfully joined
    // if this is for THIS player
    //      move to the lobby page or game page if game already running
    //       and set team only
    function handlePlayerJoinedEvent(data) {
        if (data.uID === uID) {
            if (data.joinSuccess) {
                //set team background colour
                if (data.team === 0) {
                    userTeam = 'red-team';
                    teamColors = colors.red;
                } else if (data.team === 1) {
                    userTeam = 'blue-team';
                    teamColors = colors.blue;
                }

                // set the specials
                specialPowers = data.specials;
                for(var i = 0; i < specialPowers.length; i++){
                    specialPowers[i].enabled = true;
                    specialPowers[i].cssName = "special-" + specialPowers[i].type + "-" + specialPowers[i].idea;
                }

                joinPromise.resolve(data);
            } else {
                joinPromise.reject(data);
            }
        }
    }

    function getUserTeam() {
        return userTeam;
    }

    function getUserID() {
        return uID;
    }

    function getSpecialPowers() {
        return specialPowers;
    }

    function setUserID() {
        return uID;
    }

    function getUsername() {
        return username;
    }

    function setUserTeam(team) {
        userTeam = team;
    }

    function getTeamColor() {
        return teamColors;
    }

    /*
        Register with the network service to listen to  when the player has joined the game
    */
    NetworkService.registerListener({
        eventName: "gamePlayerJoined",
        call: handlePlayerJoinedEvent
    });



    /* --------------------
        PUBLIC API
    ---------------- */

    return {
        registerUserWithServer: registerUserWithServer,
        attemptToJoinGame: attemptToJoinGame,
        setUserTeam: setUserTeam,
        getUserTeam: getUserTeam,
        getUsername: getUsername,
        getUserID: getUserID,
        setUserID: setUserID,
        getTeamColor: getTeamColor,
        getSpecialPowers: getSpecialPowers
    };

});
