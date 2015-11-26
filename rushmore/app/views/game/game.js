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
                    
    function print(){
       $scope.inputButtonClicked('left');
    }
    
    // Enable click & dblclick events, and monitor both.
    var both = document.getElementById('right-button');
    both.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
    both.addEventListener('tap', print, false);
    both.addEventListener('dbltap', print, false);



}]);
