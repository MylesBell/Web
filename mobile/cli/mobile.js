// Include the SocketIO client library and bind to localhost and matching port
var socket = require('socket.io-client')('http://127.0.0.1:1337');

// Use the readline interface to allow CLI interaction
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

// On connect, subscribe to the mobile room
socket.on('connect', function(){
	var myRoom = "mobile"
   	socket.emit("subscribe", {name : myRoom});
   	console.log("Joined "+myRoom);
});

// On message recieve, display the message content
socket.on('message', function (data){
    console.log("Recieved message: "+data.msg);
});

// When you submit a line in the CLI, send a PING
rl.on('line', function (line) {
	var toRoom = "mobile"
    socket.emit('message', {name : toRoom, msg : "PING"});
    rl.prompt(true);
});