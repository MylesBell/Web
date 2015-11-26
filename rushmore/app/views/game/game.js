angular.module('gameView', ['ngRoute'])
.controller('GameCtrl', ['$scope', 'InputHandlerService', function($scope, InputHandlerService) {

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
