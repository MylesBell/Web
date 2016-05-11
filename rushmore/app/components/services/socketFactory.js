angular.module('myApp').factory('socket', ["socketFactory", "ENV", function(socketFactory, ENV) {

    var myIoSocket = io.connect(ENV.socketIOEndpoint);

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
}]);
