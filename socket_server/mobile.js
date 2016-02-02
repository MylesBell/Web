/*
 *
 * Mobile interface for SocketIO server
 *
*/

// Require the SocketIO library
var socketio = require('socket.io');

module.exports = {

    // Register a new user with the system
    playerRegister: function(socket, data, logger) {
        var res = {};

        if (data.username !== "") {
            res.ok = true;
            res.username = data.username;
            res.uID = socket.id;
        } else {
            res.ok = false;
        }

        return logger.log(socket, logger.loggableModules.PLAYER_REGISTER, res);
    },

    // add a player to a game
    playerJoinGame: function(socket, data, logger, playerList) {
        var res = {};

        // need to do some game code checking here
        if (data.gamecode !== "") {

            // TODO IF GAME CODE IS CORRECT
            res.ok = true;
            res.gamecode = data.gamecode;
            res.uID = socket.id;
            res.username = data.username;

            // Add player to the player list
            playerList.push({
                uID: socket.id,
                username: data.username,
                gamecode: data.gamecode,
                team: "",
                health: 1000 // hardcoded lol
            });

        } else {
            res.ok = true;
            res.message = "Invalid game code";
        }

        return logger.log(socket, logger.loggableModules.PLAYER_GAME_JOIN, res);
    },

    // remove a player from a game and the player list
    playerLeaveGame: function(socket, data, logger, playerList) {
        var res = {};

        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i].uID === socket.id) {
                playerList.splice(i, 1);
            }
        }

        res.ok = true;
        res.uID = socket.id;
        res.playerList = playerList;

        return logger.log(socket, logger.loggableModules.PLAYER_GAME_LEAVE, res);
    },

    // Direction movement control for heroes
    playerDirection: function(socket, data, logger) {
        var res = {};
        var input = {};

        if (data.direction !== "") {
            input = data.input;
            res.ok = true;
            res.input = input;
            res.uID = socket.id;
        } else {
            res.ok = false;
        }

        return logger.log(socket, logger.loggableModules.PLAYER_DIRECTION, res);
    },


    playerSwitchBase: function(socket, data, logger) {
        var res = {};

        res.ok = true;
        res.uID = socket.id;

        return logger.log(socket, logger.loggableModules.PLAYER_DIRECTION, res);
    },

    // Activate a special attack from the player
    playerSpecial: function(socket, data, logger) {
        var res = {};
        res.ok = true;
        res.uID = socket.id;

        return logger.log(socket, logger.loggableModules.PLAYER_SPECIAL, res);
    },


};