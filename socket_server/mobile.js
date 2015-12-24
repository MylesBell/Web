// Require the SocketIO library
var socketio = require('socket.io');

module.exports = {
    // Register a new user with the system
    playerRegister: function(socket, data, logger){
        var res = {};
        var username;

        if (data.username !== "") {
            username = data.username;
            res.ok = true;
            res.username = username;
            res.uID = socket.id;
        } else {
            res.ok = false;
        }

        logger.log(socket, logger.loggableModules.PLAYER_REGISTER, res);
        return res;
    },
    
    // add a player to a game
    playerJoinGame : function(socket, data, logger){
        var res = {};
        
        // need to do some game code checking here
        if(data.gamecode !== ""){
            // 
            // TODO IF GAME CODE IS CORRECT
            res.ok = true;
            res.gamecode = data.gamecode;
            res.uID = socket.id;
            res.username = data.username; 
                   
        } else {
            res.ok = false;
            res.message = "Invalid game code";
        }
        
        logger.log(socket, logger.loggableModules.PLAYER_GAME_JOIN, res);
        return res;
    },

    // Direction movement control for heroes
    playerDirection: function(socket, data, logger){
        var res = {};
        var input = {};

        if (data.direction !== "") {
            input = data.input;
            res.ok = true;
            res.input = input;
            res.uID = socket.id;
        } else {
            res.ok = false;
        }

        logger.log(socket, logger.loggableModules.PLAYER_DIRECTION, res);
        return res;
    },

};
