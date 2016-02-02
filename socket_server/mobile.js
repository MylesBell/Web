/*
 *
 * Mobile interface for SocketIO server
 *
*/

// Export these functions for external access from other interfaces
var socketio = require('socket.io');
var utils = require('./utils');

module.exports = {

    /* 
        Register a new user with the system
    */
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

    /* 
        Add a player to a game
    */
    playerJoinGame: function(socket, data, logger, playerList) {
        var res = {};

        // Check that they have entered a non-blank gamecode
        if (data.gamecode !== "") {

            res.ok = true;
            res.gamecode = data.gamecode;
            res.uID = socket.id;
            res.username = data.username;

            // Add player to the player list
            utils.addPlayerToList(socket.id, playerList);

        } else {
            res.ok = true;
            res.message = "Invalid game code";
        }

        return logger.log(socket, logger.loggableModules.PLAYER_GAME_JOIN, res);
    },

    /* 
        Remove a player from a game and the player list
    */
    playerLeaveGame: function(socket, data, logger, playerList) {
        var res = {};

        // Remove the player from the player list
        utils.removePlayerFromList(socket.id, playerList);

        res.ok = true;
        res.uID = socket.id;
        res.playerList = playerList;

        return logger.log(socket, logger.loggableModules.PLAYER_GAME_LEAVE, res);
    },

    /*
        Direction movement control for heroes
    */
    playerDirection: function(socket, data, logger) {
        var res = {};
        var input = {};

        // If they have supplied a valid direction
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

    /* 
        Switch the player to the other base
    */
    playerSwitchBase: function(socket, data, logger) {
        var res = {};

        res.ok = true;
        res.uID = socket.id;

        return logger.log(socket, logger.loggableModules.PLAYER_SWITCH_BASE, res);
    },

    /*
        Activate a special attack from the player
    */
    playerSpecial: function(socket, data, logger) {
        var res = {};
        res.ok = true;
        res.uID = socket.id;

        return logger.log(socket, logger.loggableModules.PLAYER_SPECIAL, res);
    },


};