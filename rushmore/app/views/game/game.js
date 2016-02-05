angular.module('gameView', ['ngRoute'])
    .controller('GameCtrl', ['$scope', 'InputHandlerService', "NetworkService", "UserService", "$interval", "SpecialPowerManagerService", function($scope, InputHandlerService, NetworkService, UserService, $interval, SpecialPowerManagerService) {

        $scope.teamClass = UserService.getUserTeam();
        $scope.teamClassCSS = "blue-team";
        $scope.nearBase = false;
        $scope.playerDead = false;
        $scope.timeToRespawn = 10;

        var respawnTimer; // TODO put this into a timer service
        var timeToRespawn = 5;

        var downButton = document.getElementById('down-button');
        var upButton = document.getElementById('up-button');
        var forwardButton = document.getElementById('forward-button');
        var backwardButton = document.getElementById('backward-button');
        var switchButton = document.getElementById('switch-button');

        // Catch and prevent long presses when users are pressing buttons
        window.oncontextmenu = function(event) {
            console.log("Prevented long press");
            event.preventDefault();
            event.stopPropagation();
            return false;
        };

        setTeamBackground();
        fillGameContainerSize();

        // TODO put this somewhere else
        $scope.specialPowers = [{
            class: "special-fire",
            enabled: "",
            index: 1
        }, {
            class: "special-heal",
            enabled: "",
            index: 2
        }, {
            class: "special-invisible",
            enabled: "",
            index: 3
        }];

        /*
            Registering for events from the server
        */

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
            Handle game events sent by the server
        */

        // Sent from the server when the player respawns in the game, starts the respawn process
        function handleGamePlayerRespawn(data) {
            console.log("Player respawned on the server");
            playerRespawnTimeOver();
        }

        // handle when a special button is clicked
        // grey/hide button and set timer, when cooldown over reset the special button
        function handleSpecialClicked(specialUsed) {
            if (specialUsed.enabled === "") {

                // set the disabled class for the special object in markup
                specialUsed.enabled = "special-disabled";
                $scope.inputButtonClicked("special");


                // take off the disbaled css when the timeout is over
                SpecialPowerManagerService.specialButtonUsed(specialUsed).then(function(special) {
                    special.enabled = "";
                });
            } else {
                // special is still cooling down
            }
        }

        // Called when The player has died on the server, Change to the respawn screen and start the respawn timer
        // The timeleft is the time from now until when they should respawn (timestamp sent by the server)
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
            var healthBar = document.getElementById("health-bar-remaining");
            var lostHealthBar = document.getElementById("health-bar-lost");

            var remainingHealth = (data.playerHealth / data.maxHealth);

            var reaminingWidth = 100 * remainingHealth;
            var lostWidth = 100 * (1 - remainingHealth);

            if (remainingHealth < 0.5) {
                healthBar.style.backgroundColor = "#D35400"; //burnt ornage
                lostHealthBar.style.backgroundColor = "#EB974E"; // sea buckthorn
            } else {
                healthBar.style.backgroundColor = "#26A65B"; //burnt ornage
                lostHealthBar.style.backgroundColor = "#90C695"; // sea buckthorn
            }

            reaminingWidth = reaminingWidth.toString() + "%";
            lostWidth = lostWidth.toString() + "%";
            healthBar.style.width = reaminingWidth;
            lostHealthBar.style.width = lostWidth;
        }


        /*
            Helper functions 
        */

        // Change the background colour of the container to the teams colours
        function setTeamBackground() {
            var colors = UserService.getTeamColor();

            var mainContainer = document.getElementById('main-container');
            var controlsContainer = document.getElementById('controls-container');
            var statsContainer = document.getElementById('stats-container');
            var specialsContainer = document.getElementById('specials-container');

            controlsContainer.style.backgroundColor = colors.primary;
            statsContainer.style.backgroundColor = colors.dark;
            specialsContainer.style.backgroundColor = colors.primary;

            if ($scope.teamClass === "blue-team") {
                $scope.teamClassCSS = "blue-team";
            } else {
                $scope.teamClassCSS = "red-team";
            }
        }

        function fillGameContainerSize() {
            console.log("setting full screen");
            var container = document.getElementById('game-container');
            container.style.height = "100%";
            container.style.top = "0px";
        }

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
        // will clear itself when it gets to 0 BUT not call the respawn, this only on the server's command
        function respawnTimerUpdate() {
            $scope.timeToRespawn = $scope.timeToRespawn - 1;
            timeToRespawn = timeToRespawn - 1;
            if (timeToRespawn <= 0) {
                $interval.cancel(respawnTimer);
                console.log("timer is done");
            }
        }

        /*
            Code to handle double click events on webkit (IOS) browsers        
        */

        //  Fired when user selects input button on game controller page
        // input can be one of several driections or powers, sends this input to the server
        // TODO rename this function to movement changed
        $scope.inputButtonClicked = function(direction) {
            InputHandlerService.handleInput({
                direction: direction
            }).then(function(res) {
                console.log(res);
            }).catch(function(res) {
                console.log(res);
            });
        };


        function switchLane() {
            $scope.inputButtonClicked("switch");
        }

        $scope.useSpecial = function(specialNumber) {
            handleSpecialClicked(specialNumber); // TODO made this generic to other special button
        };

    }]);