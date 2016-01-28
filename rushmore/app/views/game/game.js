angular.module('gameView', ['ngRoute'])
    .controller('GameCtrl', ['$scope', 'InputHandlerService', "NetworkService", "UserService", "$interval", "SpecialPowerManagerService", function($scope, InputHandlerService, NetworkService, UserService, $interval, SpecialPowerManagerService) {

        $scope.teamClass = UserService.getUserTeam();
        $scope.teamClassCSS = "blue-team";
        $scope.nearBase = false;
        $scope.playerDead = false;
        $scope.timeToRespawn = 10;

        $scope.specialDisabled = -1;

        var respawnTimer;
        var timeToRespawn = 5;
        var specialCooldownTime = 5;

        var downButton = document.getElementById('down-button');
        var upButton = document.getElementById('up-button');
        var forwardButton = document.getElementById('forward-button');
        var backwardButton = document.getElementById('backward-button');
        var switchButton = document.getElementById('switch-button');
        var specialButton1 = document.getElementById('special-button-1');
        var specialButton2 = document.getElementById('special-button-2');
        var specialButton3 = document.getElementById('special-button-3');
        var healthBar = document.getElementById("health-bar-remaining");

        setTeamBackground();

        $scope.specialPowers = [{
            class: "special-fire",
            enabled: true,
            index: 1
        }, {
            class: "special-heal",
            enabled: true,
            index: 2
        }, {
            class: "special-invisible",
            enabled: true,
            index: 3
        }];

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

        function setTeamBackground() {
            if ($scope.teamClass === 1) {
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
            var width = 100 * (data.playerHealth / data.maxHealth);
            width = width.toString() + "%";
            healthBar.style.width = width;
        }

        // THe player has died on the server
        // Change to the respawn screen and start the respawn timer
        // THe timeleft is the time from now until when they should respawn (sent by the server)
        function handleGamePlayerDied(data) {
            // use ceil to get rid of the decimal places
            var timeLeft = Math.ceil(data.respawnTimestamp) - Math.ceil((Date.now() / 1000));

            // show the respawn screen
            $scope.teamClassCSS = "dead-team";
            $scope.playerDead = true;
            $scope.timeToRespawn = timeLeft; // should be timeleft

            // Set and start the the respawn timer 
            respawnTimer = $interval(respawnTimerUpdate, 1000);
        }

        // TODO Needs to be confirmed with the server
        // Shows the player controls again, sets the health bar to full and puts background on again
        function playerRespawnTimeOver() {
            $scope.timeToRespawn = "Now";
            $scope.playerDead = false;
            handlePlayerChangeHealth({
                playerHealth: 1000,
                maxHealth: 1000
            });
            setTeamBackground();
        }

        // When called, will reduced the time to respawn by 1 each second
        // will clear it'self when it gets to 0, then call the respawn function
        function respawnTimerUpdate() {
            $scope.timeToRespawn = $scope.timeToRespawn - 1;
            timeToRespawn = timeToRespawn - 1;
            if (timeToRespawn <= 0) {
                $interval.cancel(respawnTimer);
                console.log("timer is done");
            }
        }

        // Send from the server when the player respawns, not used at the moment
        function handleGamePlayerRespawn(data) {
            console.log("Player respawned on the server");
            playerRespawnTimeOver();
        }

        // handle when a special button is clicked
        // grey/hide button and set timer, when cooldown over reset the special button
        function handleSpecialClicked(specialUsed) {

            $scope.specialDisabled = specialUsed;
            console.log(specialUsed);

            SpecialPowerManagerService.specialButtonUsed().then(function() {
                $scope.specialDisabled = -1;
            });

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

        $scope.useSpecial = function(specialNumber) {
            $scope.inputButtonClicked("special");
            handleSpecialClicked(specialNumber); // TODO made this generic to other special button
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
        // specialButton1.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        // specialButton1.addEventListener('tap', function() {
        //     useSpecial(1);
        // }, false);
        // specialButton1.addEventListener('dbltap', function() {
        //     useSpecial(1);
        // }, false);
        // specialButton2.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        // specialButton2.addEventListener('tap', function() {
        //     useSpecial(2);
        // }, false);
        // specialButton2.addEventListener('dbltap', function() {
        //     useSpecial(2);
        // }, false);
        // specialButton3.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        // specialButton3.addEventListener('tap', function() {
        //     useSpecial(3);
        // }, false);
        // specialButton3.addEventListener('dbltap', function() {
        //     useSpecial(3);
        // }, false);

    }]);