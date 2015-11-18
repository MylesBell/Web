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



}]);