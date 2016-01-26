// Require the SocketIO library
var socketio = require('socket.io');
var logger = require('./logger');
var mobile = require('./mobile');
var unity = require('./unity');

var port = 1337;

// Start listening on a non-root-locked port
var io = socketio.listen(port);

var UNITY_CHAN = "unity";
var MOBILE_CHAN = "mobile";

// Array to store list of players in a game
var playerList = [];

// Get the logging level from the command line
var loggingLevel = process.argv.slice(2)[0];
if (loggingLevel !== undefined) {
    loggingLevel = loggingLevel.split("=")[1];
} else {
    loggingLevel = "FULL";
}

// Get testing level from command line
var testingEnabled = process.argv.slice(3)[0];
if (testingEnabled !== undefined) {
    testingEnabled = testingEnabled.split("=")[1];
    if (testingEnabled === "TRUE") {
        testingEnabled = true;
    }
} else {
    testingEnabled = false;
}

console.log("socket server listening on " + port + " logging set to " + loggingLevel + " testing is " + testingEnabled);

io.on('connection', function(socket) {

    var housekeeping = new logger();
    housekeeping.setLoggingLevel(loggingLevel);

    housekeeping.connect(socket, housekeeping.logger);

    socket.on('disconnect', function(data) {
        var res = mobile.playerLeaveGame(socket, data, housekeeping.logger, playerList);

        // Tell the Unity server they have left the game       
        if (res.ok) {
            io.sockets.in(UNITY_CHAN).emit('playerLeave', res);
        }
    });

    socket.on('subscribe', function(data) {
        housekeeping.subscribe(socket, data, housekeeping.logger);
    });

    /* 
     ----------------------
      Mobile events 
     ----------------------
    */

    /*
        New player wants to register in the system with a name and socket id
    */
    socket.on('playerRegister', function(data, callback) {
        var res = mobile.playerRegister(socket, data, housekeeping.logger);

        // Return the response back to the client, either success or failure, to fufilled the promise
        callback(res);
    });

    /*
        Registered player wants to join a game using a game code
        Adds the inital player data to the player list        
    */
    socket.on("playerJoinGame", function(data, callback) {
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
                state: 1, //the state for playing
                ok: 1 // code was correct
            }, housekeeping.logger, playerList);

            // Communicate successful join to the joining player and
            // update all other clients in the game with new player
            if (unityRes.ok) {
                // console.log(playerList);
                playerList.forEach(function(pl) {
                    io.sockets.in(pl.uID).emit('gamePlayerJoined', unityRes);
                });
            }
        }

        callback(res);
    });

    socket.on('playerDirection', function(data) {
        var res = mobile.playerDirection(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(UNITY_CHAN).emit('playerDirection', res);
        }
    });

    /* Unity events */
    socket.on('gamePlayerRespawn', function(data) {
        var res = unity.gamePlayerRespawn(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(MOBILE_CHAN).emit('gamePlayerRespawn', res);
        }
    });

    socket.on('gamePlayerDied', function(data) {
        var res = unity.gamePlayerDied(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(MOBILE_CHAN).emit('gamePlayerDied', res);
        }
    });

    socket.on('gameStateUpdate', function(data) {
        var res = unity.gameStateUpdate(socket, data, housekeeping.logger);

        if (res.ok) {
            io.sockets.in(MOBILE_CHAN).emit('gameStateUpdate', res);
        }
    });

    /*
        Called by Unity Server when a player has successfuly joined the game

        Updates that players info to what team they have been asssigned to
        Also broadcasts this event to all clients in that game to update their own player list

        TODO get gamecode back from server
             
    */
    socket.on('gamePlayerJoined', function(data) {
        var res = unity.gamePlayerJoined(socket, data, housekeeping.logger, playerList);

        // Communicate successful join to the joining player and
        // update all other clients in the game with new player
        if (res.ok) {
            playerList.forEach(function(pl) {
                io.sockets.in(pl.uID).emit('gamePlayerJoined', res);
            });
        }
    });

});