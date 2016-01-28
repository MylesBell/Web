angular.module('gameView', ['ngRoute'])
    .controller('GameCtrl', ['$scope', 'InputHandlerService', "NetworkService", "UserService", "$interval", function($scope, InputHandlerService, NetworkService, UserService, $interval) {

        $scope.teamClass = UserService.getUserTeam();
        $scope.teamClassCSS = "blue-team";
        $scope.nearBase = false;
        $scope.playerDead = false;
        $scope.timeToRespawn = 10;

        var respawnTimer;

        var downButton = document.getElementById('down-button');
        var upButton = document.getElementById('up-button');
        var forwardButton = document.getElementById('forward-button');
        var backwardButton = document.getElementById('backward-button');
        var switchButton = document.getElementById('switch-button');
        var specialButton1 = document.getElementById('special-button-1');
        var healthBar = document.getElementById("health-bar-remaining");

        setTeamBackground();

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

        function setTeamBackground(){
            if($scope.teamClass === 1){
                $scope.teamClassCSS = "blue-team";
            } else {
                $scope.teamClassCSS = "blue-team";
            }
        }

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
            console.log("PLAYER DIED, time left: ");

            var timeLeft = Math.ceil(data.respawnTimestamp) - Math.ceil((Date.now() / 1000));

            console.log(timeLeft);
            console.log(data);

            $scope.teamClassCSS = "dead-team";
            $scope.playerDead = true;
            $scope.timeToRespawn = timeLeft; // should be timeleft

            // Set and start the the respawn timer 
            respawnTimer = $interval(respawnTimerUpdate, 1000);  
        }

        // TODO Needs to be confirmed with the server
        function playerRespawnTimeOver(){
            $scope.timeToRespawn = "Now";
            $scope.playerDead = false;
            handlePlayerChangeHealth({playerHealth:1000});
            setTeamBackground();
        }

        // When called, will reduced the time to respawn by 1 each second
        // will clear it'self when it gets to 0
        function respawnTimerUpdate() {
            $scope.timeToRespawn = $scope.timeToRespawn - 1;
            if ($scope.timeToRespawn <= 0) {
                $interval.cancel(respawnTimer);
                playerRespawnTimeOver();
            }
        }

        function handleGamePlayerRespawn(data) {
            console.log("Player respawned on the server");
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
            call: handleGamePlayerDied
        });

        NetworkService.registerListener({
            eventName: "gamePlayerRespawn",
            call: handleGamePlayerRespawn
        });

        /*
            Code to handle double click events on webkit (IOS) browsers        
        */
        var HAS_TOUCH = ('ontouchstart' in window);

        function up() {
            $scope.inputButtonClicked('up');

            // REMOVE THIS
            // handleGamePlayerDied({
            //     respawnTimestamp: "1453987486.7269"
            // });
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