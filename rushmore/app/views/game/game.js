angular.module('gameView', ['ngRoute'])
.controller('GameCtrl', ['$scope', 'InputHandlerService', "NetworkService", function($scope, InputHandlerService, NetworkService) {

    /*
		Fired when user selects input button on game controller page
		input can be one of several driections
		sends this input to the server
	*/
    $scope.inputButtonClicked = function(direction) {
        InputHandlerService.handleInput({
            direction: direction
        }).then(function(res) {
            console.log(res);
        }).catch(function(res) {
            console.log(res);
        });
    };
    
    $scope.team = 0;
    
    /*
        Register with the network service to listen to game events fired from the server
    */
    NetworkService.registerListener({eventName: "gamePlayerJoined", call: playerJoinedEvent});
    
    function playerJoinedEvent(data){
        if(data.team === 0){
            console.log("RED TEAM");
        } else if(data.team === 1){
            console.log("BLUE TEAM");
        }
    }
    
    
    
    
    var HAS_TOUCH = ('ontouchstart' in window);
                    
    function up(){
       $scope.inputButtonClicked('up');
    }
    
     function down(){
       $scope.inputButtonClicked('down');
    }
    
    function forward(){
       $scope.inputButtonClicked('forward');
    }
    
     function backward(){
       $scope.inputButtonClicked('backward');
    }
    
    // Enable click & dblclick events, and monitor both.
    var downButton = document.getElementById('down-button');
    var upButton = document.getElementById('up-button');
    var forwardButton = document.getElementById('forward-button');
    var backwardButton = document.getElementById('backward-button');
    downButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
    downButton.addEventListener('tap', down, false);
    downButton.addEventListener('dbltap', down, false);
    upButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
    upButton.addEventListener('tap', up, false);
    upButton.addEventListener('dbltap', up, false);
    forwardButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
    forwardButton.addEventListener('tap', forward, false);
    forwardButton.addEventListener('dbltap', forward, false);
    backwardButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
    backwardButton.addEventListener('tap', backward, false);
    backwardButton.addEventListener('dbltap', backward, false);



}]);
