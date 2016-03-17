/*
    Service that contains the user information and handles user interaction events such as
    Registering user with server
    Set username for game
*/
angular.module('UserServiceModule', []).factory('UserService', function($q, NetworkService, LocationService, SpecialPowerManagerService, ColorService) {

    var uID = "";
    var userTeam = "";
    var username = "";
    var joinPromise;
    var specialPowers = [];
    var gameState = 0;

    // set to an inital value, changed when the user is assigned a team
    var teamColors = ColorService.getBlueColors();

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
                    teamColors = ColorService.getRedColors();
                } else if (data.team === 1) {
                    userTeam = 'blue-team';
                    teamColors = ColorService.getBlueColors();
                }

                // set the specials and gamestate
                specialPowers = SpecialPowerManagerService.setupSpecials(data.specials);
                gameState = data.state;

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
        // Return default set if non given, used for refresh
        if (specialPowers.length === 0) {
            specialPowers = [{
                "id": 0,
                "name": "Flame Ring Attack",
                "type": "Attack",
                "idea": "Melee",
                "description": "Immediately cripple enemies close to you.",
                "filename": "",
                "cooldownTime": 10.0,
                "numberOfUpgrades": 5,
                "done": true,
                "enabled": true,
                "cssName": "special-Attack-Melee",
                "image": "images/flame_red.png"
            }, {
                "id": 3,
                "name": "Defense Buff",
                "type": "Buff",
                "idea": "Defense",
                "description": "Increase your defense to you can take more punishment.",
                "filename": "",
                "cooldownTime": 2.0,
                "numberOfUpgrades": 5,
                "done": true,
                "enabled": true,
                "cssName": "special-Buff-Defense",
                "image": "images/health_buff_blue.png"
            }, {
                "id": 6,
                "name": "Healing Ring Spell",
                "type": "Heal",
                "idea": "Self-and-close",
                "description": "Immediately heal teammates close to you.",
                "filename": "",
                "cooldownTime": 5.0,
                "numberOfUpgrades": 5,
                "done": true,
                "enabled": true,
                "cssName": "special-Heal-Self-and-close",
                "image": "images/heal_group_green.png"
            }, ];
        }
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

    function getGameState() {
        return gameState;
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
        getSpecialPowers: getSpecialPowers,
        getGameState: getGameState
    };

});