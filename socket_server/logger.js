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

    // Log the client disconnects
    self.disconnect = function (socket, logger) {
        // Handle disconnect methods later
        self.logger.log(socket, logger.loggableModules.DISCONNECT);
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
            if(self.loggingLevel !== "SILENT") {
                console.log("[" + socket.id + "] " + method + " : " + JSON.stringify(data));
            }
        }
    };

}

module.exports = logger;
