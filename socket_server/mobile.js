// Require the SocketIO library
var socketio = require('socket.io');

module.exports = {

    // Register a new user with the system
    playerRegister: function(socket, data, logger) {
        var res = {};
        var username;

        if (data.username !== "") {
            username = data.username;
            res.ok = true;
            res.username = username;
            res.uID = socket.id;
        } else {
            res.ok = false;
        }

        logger.log(socket, logger.loggableModules.PLAYER_REGISTER, res);
        return res;
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
                team: ""
            });

        } else {
            res.ok = false;
            res.message = "Invalid game code";
        }

        logger.log(socket, logger.loggableModules.PLAYER_GAME_JOIN, res);
        return res;
    },

    // remove a player from a game
    playerLeaveGame: function(socket, data, logger, playerList) {
        var res = {};

        res.ok = true;
        res.uID = socket.id;

        playerList =  playerList.filter(function(pl) {
            return pl.uID !== socket.id;
        });

        logger.log(socket, logger.loggableModules.PLAYER_GAME_LEAVE, res);
        return res;
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

        logger.log(socket, logger.loggableModules.PLAYER_DIRECTION, res);
        return res;
    },

    // Activate a special attack from the player
    playerSpecial: function(socket, data, logger) {
        var res = {};
        res.ok = true;

        logger.log(socket, logger.loggableModules.PLAYER_SPECIAL, res);
        return res;
    },


};