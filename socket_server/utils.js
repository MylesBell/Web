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

    /*
        Add a player to the player list
    */
    addPlayerToList: function(playerID, playerList) {
        playerList.push({
            uID: playerID,
            username: data.username,
            gamecode: data.gamecode,
            team: "",
            health: 1000
        });
    },

    /*
        Remove a player from the player list
    */
    addPlayerToList: function(playerID, playerList) {
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i].uID === playerID) {
                playerList.splice(i, 1);
            }
        }
    },

    /*
    	Log whenever a client joins

    	NOTE: We do not join them at this point as we implement
    	our own version of namespacing
    */
    connect : function(socket, logger){
        logger.log(socket, logger.loggableModules.CONNECT);
    },

    /*
     	Join client to a namespace
    */
    subscribe : function (socket, data, logger) {
        socket.join(data.name);
        logger.log(socket, logger.loggableModules.SUBSCRIBE, data);
    }

};
