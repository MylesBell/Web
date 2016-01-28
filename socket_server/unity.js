// Require the SocketIO library
var socketio = require('socket.io');

module.exports = {
    // Player died in game
    gamePlayerDied: function(socket, data, logger){
        var res = {};
        res.ok = true;
        res.playerID = data.playerID;
        res.respawnTimestamp = data.respawnTimestamp;

        logger.log(socket, logger.loggableModules.GAME_PLAYER_DIED, res);
        return res;
    },

    // Player came back to life in the game
    // set the players health back to max
    gamePlayerRespawn: function(socket, data, logger, playerList){
        var res = {};
        var player;

        player = playerList.filter(function(pl) {
            return pl.uID === data.playerID;
        })[0];

        player.health = player.maxHealth;

        res.ok = true;
        res.uID = data.playerID;
        res.playerHealth = player.maxHealth;

        logger.log(socket, logger.loggableModules.GAME_PLAYER_RESPAWN, res);
        return res;
    },

    // Game state updated
    gameStateUpdate: function(socket, data, logger){
        var res = {};
        res.ok = false;

        if (data.state) {
            res.ok = true;
            res.state = data.state;
            res.winner = data.winner;
        }

        logger.log(socket, logger.loggableModules.GAME_STATE_UPDATE, res);
        return res;
    },

    // Game state updated
    gamePlayerJoined: function(socket, data, logger, playerList){
        var res = {};
        var playerWhoJoined = {};

        playerWhoJoined =  playerList.filter(function(pl) {
            return pl.uID === data.playerID;
        })[0];

        if (data.ok === 1 && data.playerID && playerWhoJoined !== undefined) {
            res.ok = true;
            res.uID = data.playerID;
            res.team = data.teamID;
            res.state = data.state;
            res.username = playerWhoJoined.username;
            res.playerList = playerList;

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
            console.log("ERROR " + data.msg);
        }

        logger.log(socket, logger.loggableModules.GAME_PLAYER_JOIN, res);
        return res;
    },

    playerNearBase: function (socket, data, logger) {
        var res = {};

        res.uID = data.playerID;
        res.nearBase = data.nearBase;
        res.ok = true;

        logger.log(socket, logger.loggableModules.PLAYER_NEAR_BASE, res);
        return res;
    },

    /*
        Player has either gained or lost a unit of health by "amount"
    */
    gamePlayerChangeHealth: function(socket, data, logger, playerList) {
        var res = {};
        var player;

        player = playerList.filter(function(pl) {
            return pl.uID === data.playerID;
        })[0];
        
        player.health = player.health + data.amount;

        res.uID = player.uID;
        res.playerHealth = player.health;
        res.maxHealth = player.maxHealth;
        res.ok = true;

        logger.log(socket, logger.loggableModules.PLAYER_HEALTH_CHANGE, res);
        return res;
    }

};
