/*
 *
 * Unity Interface for SocketIO server
 *
 */

// Require dependencies for interface
var socketio = require('socket.io');
var utils = require('./utils');
var specialsJSON = require('../rushmore/app/resources/json/specialsList.json');

// Export these functions for external access from other interfaces
module.exports = {

    /* 
        Player has died in the game
    */
    gamePlayerDied: function (socket, data, logger) {
        var res = {};
        res.ok = true;
        res.uID = data.playerID;
        res.respawnTimestamp = data.respawnTimestamp;

        return logger.log(socket, logger.loggableModules.GAME_PLAYER_DIED, res);
    },

    /* 
        Player has respawned in the game
    */
    gamePlayerRespawn: function (socket, data, logger, playerList) {
        var res = {};
        var player;

        player = utils.playerFromUID(data.playerID, playerList);

        if (player) {
            player.health = player.maxHealth;

            res.ok = true;
            res.uID = data.playerID;
            res.playerHealth = player.maxHealth;
        } else {
            res.ok = false;
        }


        return logger.log(socket, logger.loggableModules.GAME_PLAYER_RESPAWN, res);
    },

    /* 
        The game state has been updated
    */
    gameStateUpdate: function (socket, data, logger) {
        var res = {};
        res.ok = false;

        if (data.state) {
            res.ok = true;
            res.state = data.state; // idle 0, 1 is playing, 2 end (game over)
            res.winner = data.winner;
        }

        return logger.log(socket, logger.loggableModules.GAME_STATE_UPDATE, res);
    },

    /* 
        The new player has joined the game
    */
    gamePlayerJoined: function (socket, data, logger, playerList) {
        var res = {};
        var playerWhoJoined = {};

        playerWhoJoined = utils.playerFromUID(data.playerID, playerList);

        if (data.ok === 1 && data.playerID && playerWhoJoined !== undefined) {

            res.ok = true;
            res.uID = data.playerID;
            res.team = data.teamID;
            res.state = data.state;
            res.username = playerWhoJoined.username;
            res.playerList = playerList;
            res.joinSuccess = true;
            res.baseMaxHealth = data.baseMaxHealth;
            res.specials = getSpecialData([data.specialOne, data.specialTwo, data.specialThree]);
            res.lane = data.lane ? "Right" : "Left";

            // This may be undefined for older unity servers connecting
            if (data.heroClass !== undefined) {
                res.heroClass = data.heroClass;
            }

            playerWhoJoined.health = data.playerMaxHealth;
            playerWhoJoined.maxHealth = data.playerMaxHealth;
            playerWhoJoined.team = data.teamID;
            playerWhoJoined.specials = res.specials;
            playerWhoJoined.heroClass = data.heroClass;
            playerWhoJoined.lane = data.lane ? "Right" : "Left";
        } else {

            if (data.ok === 0) {
                res.ok = true;
                res.joinSuccess = false;
                res.uID = data.playerID;
                res.message = "Wrong Code";
            }
            console.log("ERROR " + data.msg);
        }

        return logger.log(socket, logger.loggableModules.GAME_PLAYER_JOIN, res);
    },

    /*
        A player has moved near to the base
    */
    gamePlayerNearBase: function (socket, data, logger) {
        var res = {};

        res.uID = data.playerID;
        res.nearBase = data.nearBase;
        res.ok = true;

        return logger.log(socket, logger.loggableModules.PLAYER_NEAR_BASE, res);
    },

    /*
        A player has either gained or lost a unit of health by "amount"
    */
    gamePlayerChangeHealth: function (socket, data, logger, playerList) {
        var res = {};
        var player;

        player = utils.playerFromUID(data.playerID, playerList);

        if (player) {
            //update the players health on the server 
            player.health = player.health + data.amount;

            // send back the updated health
            res.uID = player.uID;
            res.playerHealth = player.health;
            res.maxHealth = player.maxHealth;
            res.ok = true;
        } else {
            res.ok = false;
        }

        return logger.log(socket, logger.loggableModules.PLAYER_HEALTH_CHANGE, res);
    },

    /*
        Player's base has changed health
    */
    gameBaseChangeHealth: function (socket, data, logger) {
        var res = {};

        res.uID = data.playerID;
        res.currentBaseHealth = data.currentHealth;
        res.maxBaseHealth = data.maxHealth;
        res.ok = true;

        return logger.log(socket, logger.loggableModules.BASE_HEALTH_CHANGE, res);
    },

    /*
        Player has been leveled up

        some powers may have increased their cooldowns
    */
    gamePlayerLevelUp: function (socket, data, logger) {
        var res = {};

        res.uID = data.playerID;
        res.level = data.level;
        res.ok = true;

        return logger.log(socket, logger.loggableModules.PLAYER_LEVEL_UP, res);
    },

    gamePlayerSwitchLane: function (socket, data, logger) {
        var res = {};

        res.uID = data.playerID;
        res.lane = data.lane ? "Right" : "Left";
        res.ok = true;

        return logger.log(socket, logger.loggableModules.PLAYER_SWITCH_LANE, res);
    }
};

// Add the special info from the our special JSON using the IDs sent from server
function getSpecialData(specials) {
    var specialObjects = [];

    for (var j = 0; j < specials.length; j++) {
        for (var i = 0; i < specialsJSON.items.length; i++) {
            var definedSpecial = specialsJSON.items[i];
            if (definedSpecial.id === specials[j]) {
                specialObjects.push(definedSpecial);
            }
        }
    }

    return specialObjects;
}