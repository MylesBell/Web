// Require the SocketIO library
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
    }

};
