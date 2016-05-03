/*
 *
 * SocketIO generic socket interfaces
 *
 */

// Require the dependencies for this interface
var socketio = require('socket.io');
var logger = require('./logger');
var mobile = require('./mobile');
var unity = require('./unity');
var utils = require('./utils');

// Default to port 1337
var port = 1337;

// Start listening on a non-root-locked port
var io = socketio.listen(port);

var UNITY_CHAN = "unity";
var MOBILE_CHAN = "mobile";

// Global array to store list of players in a game
var playerList = [];

// Get the logging level from the command line (defaults to FULL)
var loggingLevel = process.argv.slice(2)[0];
if (loggingLevel !== undefined) {
    loggingLevel = loggingLevel.split("=")[1];
} else {
    loggingLevel = "FULL";
}

// Get testing level from command line (defaults to FALSE)
var testingEnabled = process.argv.slice(3)[0];
if (testingEnabled !== undefined) {
    testingEnabled = testingEnabled.split("=")[1];
    if (testingEnabled === "TRUE") {
        testingEnabled = true;
    }
} else {
    testingEnabled = false;
}

// Notify that the server has begun listening and the command line parameters provided
console.log("Socket server listening on port: " + port);
console.log("Logging set to: " + loggingLevel);
console.log("Testing set to: " + testingEnabled);

// These functions are exposed to a SocketIO connection
io.on('connection', function (socket) {

    // Define a new logging instance for this connection
    var housekeeping = new logger();

    // Set the logging level to the provided logging parameter from command line
    housekeeping.setLoggingLevel(loggingLevel);

    // Fire that a new connection has been made (this just logs it as we implement our own namespacing)
    utils.connect(socket, housekeeping.logger);


    /* 
     ----------------------
      Housekeeping events 
     ----------------------
    */

    /*
        Client has subscribed to a channel - our namespace implementation
    */
    socket.on('subscribe', function (data) {
        utils.subscribe(socket, data, housekeeping.logger);
    });

    /*
        Client closes the browser or leaves the game

        Remove them from the player list, update everyone else's player list 
        and tell unity that player has left
    */
    socket.on('disconnect', function (data) {
        var res = mobile.playerLeaveGame(socket, data, housekeeping.logger, playerList);

        // Communicate disconnect both Unity server and all other players
        if (res.ok) {
            io.sockets.in(UNITY_CHAN).emit('playerLeave', res);

            playerList.forEach(function (pl) {
                io.sockets.in(pl.uID).emit('gamePlayerLeft', res);
            });
        }
    });

    /* 
     ----------------------
      Mobile events 
     ----------------------
    */
    /*
        New player wants to register in the system with a name and socket id
    */
    socket.on('playerRegister', function (data, callback) {
        var res = mobile.playerRegister(socket, data, housekeeping.logger);

        // Return the response back to the client, either success or failure, to fufilled the promise
        callback(res);
    });

    /*
        Registered player wants to join a game using a game code
        Adds the inital player data to the player list        
    */
    socket.on("playerJoinGame", function (data, callback) {
        var res = mobile.playerJoinGame(socket, data, housekeeping.logger, playerList);
        
        // If joining game was successful, tell the unity server to add them to game        
        if (res.ok) {
            io.sockets.in(UNITY_CHAN).emit('playerJoin', res);
        }
        
        // In testing mode, fake the unity server response, as we need to progress in the app
        // without needing a running unity server
        if (testingEnabled) {
            console.log("TESTING ENABLED, FAKING UNTIY GAME PLAYER JOINED RESPONSE");
            var unityRes = unity.gamePlayerJoined(socket, {
                playerID: socket.id,
                teamID: 1,
                state: 0, // 0 the state for idle (needed for testing)                
                ok: 1, // code was correct
                baseMaxHealth: 5000,
                specialOne: 11,
                specialTwo: 2,
                specialThree: 0,
                heroClass: 1
            }, housekeeping.logger, playerList);

            // Communicate successful join to the joining player and
            // update all other clients in the game with new player
            if (unityRes.ok) {
                // console.log(unityRes);
                playerList.forEach(function (pl) {
                    io.sockets.in(pl.uID).emit('gamePlayerJoined', unityRes);
                });
            }
        }

        callback(res);
    });

    /*
        Player has fired a special attack button
    */
    socket.on('playerSpecial', function (data) {
        var res = mobile.playerSpecial(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(UNITY_CHAN).emit('playerSpecial', res);
        }
    });

    /*
        Player has attempted to switch direction of movement   
    */
    socket.on('playerDirection', function (data) {
        var res = mobile.playerDirection(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(UNITY_CHAN).emit('playerDirection', res);
        }
    });

    /*
        Player has attempted to switch which base (side) they are on
    */
    socket.on('playerSwitchBase', function (data) {
        var res = mobile.playerDirection(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(UNITY_CHAN).emit('playerSwitchBase', res);
        }
    });


    /* 
        --------------------------
        Unity events
        --------------------------
    */
    /*
        A player has respawned in game    
    */
    socket.on('gamePlayerRespawn', function (data) {
        var res = unity.gamePlayerRespawn(socket, data, housekeeping.logger, playerList);

        if (res.ok) {
            io.sockets.in(res.uID).emit('gamePlayerRespawn', res);
        }
    });

    /*
        A player has died in game
    */
    socket.on('gamePlayerDied', function (data) {
        var res = unity.gamePlayerDied(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(res.uID).emit('gamePlayerDied', res);
        }
    });

    /*
        The game state has been updated
    */
    socket.on('gameStateUpdate', function (data) {
        var res = unity.gameStateUpdate(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(MOBILE_CHAN).emit('gameStateUpdate', res);
        }
    });

    /*
        A player's health has changed
    */
    socket.on('gamePlayerChangeHealth', function (data) {
        var res = unity.gamePlayerChangeHealth(socket, data, housekeeping.logger, playerList);

        if (res.ok) {
            io.sockets.in(res.uID).emit("gamePlayerChangeHealth", res);
        }
    });

    socket.on('gamePlayerSwitchLane', function (data) {
        var res = unity.gamePlayerSwitchLane(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(res.uID).emit("gamePlayerSwitchLane", res);
        }
    });

    /*
        Players base's health has changed
    */
    socket.on("gameBaseChangeHealth", function (data) {
        var res = unity.gameBaseChangeHealth(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(res.uID).emit("gameBaseChangeHealth", res);
        }
    });

    /*
        A player has successfully joined the game

        Updates that players info to what team they have been asssigned to
        Also broadcasts this event to all clients in that game to update their own player list
    */
    socket.on('gamePlayerJoined', function (data) {
        var res = unity.gamePlayerJoined(socket, data, housekeeping.logger, playerList);

        // Communicate successful join to the joining player and
        // update all other clients in the game with new player
        if (res.ok) {
            playerList.forEach(function (pl) {
                io.sockets.in(pl.uID).emit('gamePlayerJoined', res);
            });
        }
    });

    /*
        Player has been leveled up
    */
    socket.on("gamePlayerLevelUp", function (data) {
        var res = unity.gamePlayerLevelUp(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(res.uID).emit("gamePlayerLevelUp", res);
        }
    });
    
    /*
        Statitics about the game for all players, sent at the end of a game
    */
    socket.on('gamePlayersStats', function(data){
       console.log(data);
       
       io.sockets.in(MOBILE_CHAN).emit("gamePlayersStats", data); 
    });



});