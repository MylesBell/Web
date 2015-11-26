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
        }

        logger.log(socket, logger.loggableModules.GAME_STATE_UPDATE, res);
        return res;
    },

};
