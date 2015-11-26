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
                    
    function left(){
       $scope.inputButtonClicked('left');
    }
    
     function right(){
       $scope.inputButtonClicked('right');
    }
    
    // Enable click & dblclick events, and monitor both.
    var rightButton = document.getElementById('right-button');
    var leftButton = document.getElementById('left-button');
    rightButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
    rightButton.addEventListener('tap', right, false);
    rightButton.addEventListener('dbltap', right, false);
    leftButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
    leftButton.addEventListener('tap', left, false);
    leftButton.addEventListener('dbltap', left, false);



}]);
