// Require the SocketIO library
var socketio = require('socket.io');

module.exports = {
    // Player died in game
    gamePlayerDied: function(socket, data, logger){
        var res = {};
        res.ok = true;

        logger.log(socket, logger.loggableModules.GAME_PLAYER_DIED, res);
        return res;
    },

    // Player died in game
    gamePlayerRespawn: function(socket, data, logger){
        var res = {};
        res.ok = true;

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

        if (res.ok === 1 && data.playerID && playerWhoJoined !== undefined) {
            res.ok = true;
            res.uID = data.playerID;
            res.team = data.teamID;
            res.state = data.state;
            res.username = playerWhoJoined.username;
            res.playerList = playerList;

            playerWhoJoined.team = data.teamID;
        } else{
            console.log("ERROR " + data.msg);
        }

        logger.log(socket, logger.loggableModules.GAME_PLAYER_JOIN, res);
        return res;
    },

};
