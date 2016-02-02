/*
 *
 * Unity Interface for SocketIO server
 *
*/

// Require dependencies for interface
var socketio = require('socket.io');
var utils = require('./utils');

// Export these functions for external access from other interfaces
module.exports = {

    /* 
        Player has died in the game
    */
    gamePlayerDied: function(socket, data, logger){
        var res = {};
        res.ok = true;
        res.uID = data.playerID;
        res.respawnTimestamp = data.respawnTimestamp;

        return logger.log(socket, logger.loggableModules.GAME_PLAYER_DIED, res);
    },

    /* 
        Player has respawned in the game
    */
    gamePlayerRespawn: function(socket, data, logger, playerList){
        var res = {};
        var player;

        player = utils.playerFromUID(data.playerID, playerList);
        player.health = player.maxHealth;

        res.ok = true;
        res.uID = data.playerID;
        res.playerHealth = player.maxHealth;

        return logger.log(socket, logger.loggableModules.GAME_PLAYER_RESPAWN, res);
    },

    /* 
        The game state has been updated
    */
    gameStateUpdate: function(socket, data, logger){
        var res = {};
        res.ok = false;

        if (data.state) {
            res.ok = true;
            res.state = data.state;
            res.winner = data.winner;
        }

        return logger.log(socket, logger.loggableModules.GAME_STATE_UPDATE, res);
    },

    /* 
        The new player has joined the game
    */
    gamePlayerJoined: function(socket, data, logger, playerList){
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

            if(data.maxHealth !== undefined){
                playerWhoJoined.health = data.maxHealth;
                playerWhoJoined.maxHealth = data.maxHealth;
                console.log(playerWhoJoined);
            } else { // TODO this won't be undefined later when we merge stuff
                playerWhoJoined.health = 1000;
                playerWhoJoined.maxHealth = 1000;
            }


            playerWhoJoined.team = data.teamID;
        } else{
            if(data.ok === 0){
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
    gamePlayerChangeHealth: function(socket, data, logger, playerList) {
        var res = {};
        var player;

        player = utils.playerFromUID(data.playerID, playerList);
        
        player.health = player.health + data.amount;

        res.uID = player.uID;
        res.playerHealth = player.health;
        res.maxHealth = player.maxHealth;
        res.ok = true;

        return logger.log(socket, logger.loggableModules.PLAYER_HEALTH_CHANGE, res);
    }

};
