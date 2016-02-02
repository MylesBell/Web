/*
 *
 * Generic utility functions for SocketIO server
 *
*/

// Require dependencies for interface
var socketio = require('socket.io');

module.exports = {
    /*
        Determine the player object from the provided playerID
    */
    playerFromUID: function(playerID, playerList) {
        var player = playerList.filter(function(pl) {
            return pl.uID === playerID;
        })[0];

        return player;
    },

    // Log whenever a client joins
    connect : function(socket, logger){
        // Handle connect methods later due to lack of namespaces
        logger.log(socket, logger.loggableModules.CONNECT);
    };

    // As SocketIO doesn't include namespace protocols,
    // we implement our own room system using joins
    subscribe : function (socket, data, logger) {
        socket.join(data.name);
        logger.log(socket, logger.loggableModules.SUBSCRIBE, data);
    };

};
