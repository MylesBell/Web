// Require the SocketIO library
var socketio = require('socket.io');

module.exports = {
    // Log whenever a client joins
    connect: function(socket, logger){
        // Handle connect methods later
        logger.log(socket, logger.loggableModules.CONNECT);
    },

    // Log the client disconnects
    disconnect: function (socket, logger) {
        // Handle disconnect methods later
        logger.log(socket, logger.loggableModules.DISCONNECT);
    },

    // As SocketIO doesn't include namespace protocols,
    // we implement our own room system using joins
    subscribe: function (socket, data, logger) {
        socket.join(data.name);
        logger.log(socket, logger.loggableModules.SUBSCRIBE, data);
    },

    logger: {
        loggableModules : {
            "CONNECT" : "Connected",
            "DISCONNECT" : "Disconnected",
            "SUBSCRIBE" : "Subscribed",
            "PLAYER_REGISTER" : "Player Registration",
            "PLAYER_GAME_JOIN" : "Player Game Join",
            "PLAYER_DIRECTION" : "Player Direction",
            "GAME_PLAYER_DIED" : "Game Player Died",
            "GAME_PLAYER_RESPAWN" : "Game Player Respawn",
            "GAME_STATE_UPDATE" : "Game State Update",
            "GAME_PLAYER_JOIN" : "Game Player Joined"
        },
        log: function (socket, method, data) {
            console.log("[" + socket.id + "] " + method + " : " + JSON.stringify(data));
        }
    }
};
