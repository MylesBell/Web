/*
 *
 * Internal logging for SocketIO server
 *
*/

// Require dependencies for interface
var socketio = require('socket.io');

function logger() {
    var self = this;

    // Default to full logging printouts
    self.loggingLevel = "FULL";

    // Set the logging level as
    // FULL, SILENT
    self.setLoggingLevel = function(level){
        self.loggingLevel = level;
    };

    self.logger = {
        // These loggable modules allow us to have better display notifications for the logged events
        loggableModules : {
            "CONNECT" : "Connected",
            "SUBSCRIBE" : "Subscribed",
            "PLAYER_REGISTER" : "Player Registration",
            "PLAYER_GAME_JOIN" : "Player Game Join",
            "PLAYER_GAME_LEAVE" : "Player Game Leave",
            "PLAYER_DIRECTION" : "Player Direction",
            "PLAYER_SWITCH_BASE" : "Player Switch Base",
            "PLAYER_SPECIAL" : "Player Special",
            "GAME_PLAYER_DIED" : "Game Player Died",
            "GAME_PLAYER_RESPAWN" : "Game Player Respawn",
            "GAME_STATE_UPDATE" : "Game State Update",
            "GAME_PLAYER_JOIN" : "Game Player Joined",
            "PLAYER_NEAR_BASE" : "Player Near Base",
            "PLAYER_HEALTH_CHANGE" : "Player Health Change",
            "BASE_HEALTH_CHANGE" : "Base Health Change",
            "PLAYER_LEVEL_UP" : "Player Level Up" 
        },
        log: function (socket, method, data) {
            if(self.loggingLevel !== "SILENT") {
                console.log("[" + socket.id + "] " + method + " : " + JSON.stringify(data));
            }

            // Return the recieved data so we can return directly from log() outside the interface
            return data;
        }
    };

}

// Export the entire logger class
module.exports = logger;
