angular.module('myApp').factory('socket', function(socketFactory, ENV) {

    var myIoSocket = io.connect(ENV.socketIOEndpoint);

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
});
