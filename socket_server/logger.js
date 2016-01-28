// Require the SocketIO library
var socketio = require('socket.io');

function logger() {

    var self = this;
    self.loggingLevel = "FULL";

    // Log whenever a client joins
    self.connect = function(socket, logger){
        // Handle connect methods later
        self.logger.log(socket, logger.loggableModules.CONNECT);
    };

    // As SocketIO doesn't include namespace protocols,
    // we implement our own room system using joins
    self.subscribe = function (socket, data, logger) {
        socket.join(data.name);
        self.logger.log(socket, logger.loggableModules.SUBSCRIBE, data);
    };

    // Set the logging level as
    // FULL, SILENT
    self.setLoggingLevel = function(level){
        self.loggingLevel = level;
    };

    self.logger = {
        loggableModules : {
            "CONNECT" : "Connected",
            "SUBSCRIBE" : "Subscribed",
            "PLAYER_REGISTER" : "Player Registration",
            "PLAYER_GAME_JOIN" : "Player Game Join",
            "PLAYER_GAME_LEAVE" : "Player Game Leave",
            "PLAYER_DIRECTION" : "Player Direction",
            "PLAYER_SPECIAL" : "Player Special",
            "GAME_PLAYER_DIED" : "Game Player Died",
            "GAME_PLAYER_RESPAWN" : "Game Player Respawn",
            "GAME_STATE_UPDATE" : "Game State Update",
            "GAME_PLAYER_JOIN" : "Game Player Joined",
            "PLAYER_NEAR_BASE" : "Player Near Base",
            "PLAYER_HEALTH_CHANGE" : "Player Health Change" 
        },
        log: function (socket, method, data) {
            if(self.loggingLevel !== "SILENT") {
                console.log("[" + socket.id + "] " + method + " : " + JSON.stringify(data));
            }
        }
    };

}

module.exports = logger;
