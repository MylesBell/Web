angular.module('gameView', ['ngRoute'])
    .controller('GameCtrl', ['$scope', 'InputHandlerService', "NetworkService", "UserService", "$interval", "SpecialPowerManagerService", "$rootScope", function($scope, InputHandlerService, NetworkService, UserService, $interval, SpecialPowerManagerService, $rootScope) {

        $scope.teamClass = UserService.getUserTeam();
        $scope.teamClassCSS = "blue-team";
        $scope.nearBase = false;
        $scope.playerDead = false;
        $scope.timeToRespawn = 10;

        var respawnTimer; // TODO put this into a timer service
        var timeToRespawn = 5;

        var switchButton = document.getElementById('switch-button');
        var mainContainer = document.getElementById('main-container');

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
            eventName: "gamePlayerNearBase",
            call: handleGamePlayerNearBaseEvent
        });

        NetworkService.registerListener({
            eventName: "gamePlayerChangeHealth",
            call: handleGamePlayerChangeHealth
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
            Attach event listeners to page to handle touches to both the canvas and other UI elements
            Touch events captured here are emitted on the root scope as a communication channel
            Other components (joystick) can then listen to the root scope and act when an event occurs

            This allows for multitouch of the joytick and specials at the same time
        */

        mainContainer.addEventListener('touchstart', function(e) {

            // Prevent pull down to refresh and etc
            e.preventDefault();

            // handle every touch point on the screen
            for (var i = 0; i < e.touches.length; i++) {
                var touch = e.touches[i];

                // get the element that the finger is over
                var touchedElementId = (document.elementFromPoint(touch.clientX, touch.clientY)).id;

                // either tell the canvas to start listening to events for the joystick
                if (touchedElementId === "joystick-canvas") {
                    $rootScope.$emit("canvas.touch.start", e);
                } else if (touchedElementId.indexOf("special") > -1) {
                    // or handle special powers being selected
                    $scope.specialPowers.forEach(function(sp) {
                        if (touchedElementId.indexOf(sp.index) > -1) {
                            handleSpecialClicked(sp);
                        }
                    });
                }
            }
        });

        function handleSpecial(sp) {
            if (touchedElementId.indexOf(sp.index) > -1) {
                handleSpecialClicked(sp);
            }
        }

        /*
            Handle game events sent by the server or UI
        */

        // Sent from the server when the player respawns in the game, starts the respawn process
        function handleGamePlayerRespawn(data) {
            console.log("Player respawned on the server");
            playerRespawnTimeOver();
        }

        // handle when a special button is clicked
        function handleSpecialClicked(specialUsed) {

            if (specialUsed.enabled === "") {
                // set the disabled class for the special object in markup
                $scope.inputButtonClicked("special");

                SpecialPowerManagerService.specialButtonUsed(specialUsed).then(function(special) {
                    // don't need to do anything here
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
        function handleGamePlayerNearBaseEvent(data) {
            if (data.nearBase === 0) {
                $scope.nearBase = false;
            } else {
                $scope.nearBase = true;
            }
        }

        // Reduce the width of the health bar to the fraction of remaining health
        function handleGamePlayerChangeHealth(data) {
            // var healthBar = document.getElementById("health-bar-remaining");
            // var lostHealthBar = document.getElementById("health-bar-lost");

            // var remainingHealth = (data.playerHealth / data.maxHealth);

            // var reaminingWidth = 100 * remainingHealth;
            // var lostWidth = 100 * (1 - remainingHealth);

            // if (remainingHealth < 0.5) {
            //     healthBar.style.backgroundColor = "#D35400"; //burnt ornage
            //     lostHealthBar.style.backgroundColor = "#EB974E"; // sea buckthorn
            // } else {
            //     healthBar.style.backgroundColor = "#26A65B"; //burnt ornage
            //     lostHealthBar.style.backgroundColor = "#90C695"; // sea buckthorn
            // }

            // reaminingWidth = reaminingWidth.toString() + "%";
            // lostWidth = lostWidth.toString() + "%";
            // healthBar.style.width = reaminingWidth;
            // lostHealthBar.style.width = lostWidth;
            console.log(data);
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
            var container = document.getElementById('game-container');
            container.style.height = "100%";
            container.style.top = "0px";
        }

        // Shows the player controls again, sets the health bar to full and puts background on again
        // Can only be alled by a unity event, not on client side
        function playerRespawnTimeOver() {
            $scope.timeToRespawn = "Now";
            $scope.playerDead = false;
            handleGamePlayerChangeHealth({
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
                console.log("respawn timer is done");
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


        $scope.useSpecial = function(special) {
            handleSpecialClicked(special);
        };

    }]);