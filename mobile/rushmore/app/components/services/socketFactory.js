angular.module('myApp').factory('socket', function(socketFactory, ENV) {
    var hostName = 'http://localhost:';
    var port = '1337';
    var myIoSocket = io.connect(ENV.socketIOEndpoint);

    console.log(ENV);


    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
});