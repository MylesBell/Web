angular.module('gameView', ['ngRoute'])
    .controller('GameCtrl', ['$scope', 'InputHandlerService', "NetworkService", "UserService", function($scope, InputHandlerService, NetworkService, UserService) {

        $scope.teamClass = UserService.getUserTeam();
        $scope.teamClass = "blue-team";
        $scope.nearBase = false;

        var downButton = document.getElementById('down-button');
        var upButton = document.getElementById('up-button');
        var forwardButton = document.getElementById('forward-button');
        var backwardButton = document.getElementById('backward-button');
        var switchButton = document.getElementById('switch-button');
        var specialButton1 = document.getElementById('special-button-1');
        var healthBar = document.getElementById("health-bar-remaining");

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

        // Either show or hide the switch lane button
        function handlePlayerNearBaseEvent(data) {
            if (data.nearBase === 0) {
                $scope.nearBase = false;
            } else {
                $scope.nearBase = true;
            }
        }

        // Reduce the width of the health bar to the fraction of remaining health
        function handlePlayerChangeHealth(data) {
            var width = 100 * (data.playerHealth / 1000);
            width = width.toString() + "%"; 
            healthBar.style.width = width;
        }

        function handleGamePlayerDied(data) {
            console.log("PLAYER DIED");
            console.log(data);
        }

        NetworkService.registerListener({
            eventName: "playerNearBase",
            call: handlePlayerNearBaseEvent
        });

        NetworkService.registerListener({
            eventName: "playerChangeHealth",
            call: handlePlayerChangeHealth
        });

        NetworkService.registerListener({
            eventName: "gamePlayerDied",
            call : handleGamePlayerDied
        })

        /*
            Code to handle double click events on webkit (IOS) browsers        
        */
        var HAS_TOUCH = ('ontouchstart' in window);

        function up() {
            $scope.inputButtonClicked('up');
        }

        function down() {
            $scope.inputButtonClicked('down');
        }

        function forward() {
            $scope.inputButtonClicked('forward');
        }

        function backward() {
            $scope.inputButtonClicked('backward');
        }

        function switchLane() {
            $scope.inputButtonClicked("switch");
        }

        function useSpecial() {
            $scope.inputButtonClicked("special");
        }

        // // Enable click & dblclick events, and monitor both.
        


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
        switchButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        switchButton.addEventListener('tap', switchLane, false);
        switchButton.addEventListener('dbltap', switchLane, false);
        specialButton1.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        specialButton1.addEventListener('tap', useSpecial, false);
        specialButton1.addEventListener('dbltap', useSpecial, false);


    }]);