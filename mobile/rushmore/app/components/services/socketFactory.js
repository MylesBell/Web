angular.module('myApp').factory('socket', function(socketFactory) {
    var hostName = 'http://localhost:';
    var port = '1337';
    var myIoSocket = io.connect(hostName + port);

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
});