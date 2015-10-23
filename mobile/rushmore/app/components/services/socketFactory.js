angular.module('myApp').factory('socket', function(socketFactory) {
	var hostName = 'http://localhost:';
    var port = '7777';
	var myIoSocket = io.connect(hostName + port);

	mySocket = socketFactory({
		ioSocket: myIoSocket
	});

	return mySocket;
});