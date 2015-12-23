// Require the SocketIO library
var socketio = require('socket.io');
var housekeeping = require('./housekeeping');
var mobile = require('./mobile');
var unity = require('./unity');

var port = 1337;

// Start listening on a non-root-locked port
var io = socketio.listen(port);

var UNITY_CHAN = "unity";
var MOBILE_CHAN = "mobile";

console.log("socket server listening on " + port);

io.on('connection', function(socket) {
    housekeeping.connect(socket, housekeeping.logger);

    socket.on('disconnect', function(data) {
        housekeeping.disconnect(socket, housekeeping.logger);
    });

    socket.on('subscribe', function(data) {
        housekeeping.subscribe(socket, data, housekeeping.logger);
    });

    /* 
     ----------------------
      Mobile events 
     ----------------------
    */
    
    /*
        New player wants to register in the system with a name and socket id
    */
    socket.on('playerRegister', function(data, callback) {
        var res = mobile.playerRegister(socket, data, housekeeping.logger);

        // if(res.ok){
        //     io.sockets.in(UNITY_CHAN).emit('playerJoin', res);
        // }
        
        // Return the response back to the client, either success or failure, to fufilled the promise
        callback(res);
    });
       
    /*
        Registered player wants to join a game using a game code
    */
    socket.on("playerJoinGame", function(data, callback) {
       var res = mobile.playerJoinGame(socket, data, housekeeping.logger);
       
       if(res.ok){
            io.sockets.in(UNITY_CHAN).emit('playerJoin', res);
       } 
       
       callback(res);
    });

    socket.on('playerDirection', function(data) {
        var res = mobile.playerDirection(socket, data, housekeeping.logger);

        if(res.ok){
            io.sockets.in(UNITY_CHAN).emit('playerDirection', res);
        }
    });

    /* Unity events */
    socket.on('gamePlayerRespawn', function(data) {
        var res = unity.gamePlayerRespawn(socket, data, housekeeping.logger);

        if(res.ok){
            io.sockets.in(MOBILE_CHAN).emit('gamePlayerRespawn', res);
        }
    });

    socket.on('gamePlayerDied', function(data) {
        var res = unity.gamePlayerDied(socket, data, housekeeping.logger);

        if(res.ok){
            io.sockets.in(MOBILE_CHAN).emit('gamePlayerDied', res);
        }
    });

    socket.on('gameStateUpdate', function(data) {
        var res = unity.gameStateUpdate(socket, data, housekeeping.logger);

        if(res.ok){
            io.sockets.in(MOBILE_CHAN).emit('gameStateUpdate', res);
        }
    });


    socket.on('gamePlayerJoined', function(data) {
        var res = unity.gamePlayerJoined(socket, data, housekeeping.logger);

        if(res.ok){
            io.sockets.in(res.player).emit('gamePlayerJoined', res);
        }
    });

});
