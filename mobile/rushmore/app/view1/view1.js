'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'NetworkService', function($scope, NetworkService) {
	$scope.teststring = "hello world";
	NetworkService.send("message", {name: "johnny"}).then(console.log("Done"));
}]);