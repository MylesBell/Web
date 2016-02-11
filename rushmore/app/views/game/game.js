angular.module('gameView', ['ngRoute'])
    .controller('GameCtrl', ['$scope', 'InputHandlerService', "NetworkService", "UserService", "$interval", "SpecialPowerManagerService", "$rootScope", function($scope, InputHandlerService, NetworkService, UserService, $interval, SpecialPowerManagerService, $rootScope) {

        $scope.teamClass = UserService.getUserTeam();
        $scope.teamClassCSS = "blue-team";
        $scope.nearBase = false;
        $scope.playerDead = false;
        $scope.timeToRespawn = 5;
        $scope.gameOver = false;  
        $scope.winner = "";

        var respawnTimer; // TODO put this into a timer service
        var respawnTime = $scope.timeToRespawn;

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
            eventName: "gamePlayerDied",
            call: handleGamePlayerDied
        });

        NetworkService.registerListener({
            eventName: "gamePlayerRespawn",
            call: handleGamePlayerRespawn
        });

        NetworkService.registerListener({
            eventName: "gameStateUpdate",
            call: handleGameStateUpdate
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
                    clickSpecial(touchedElementId);
                }
            }
        });

        function clickSpecial(touchedElementId) {
            $scope.specialPowers.forEach(function(sp) {
                if (touchedElementId.indexOf(sp.index) > -1) {
                    handleSpecialClicked(sp);
                }
            });
        }

        /*
            Handle game events sent by the server or UI
        */

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

            // show the respawn screen
            $scope.teamClassCSS = "dead-team";
            $scope.playerDead = true;
            $scope.timeToRespawn = respawnTime; // should be timeleft

            // Set and start the the respawn timer 
            respawnTimer = $interval(respawnTimerUpdate, 1000);
        }

        // Sent from the server when the player respawns in the game, starts the respawn process
        function handleGamePlayerRespawn(data) {
            console.log("Player respawned on the server");
            $scope.timeToRespawn = "Now";
            $scope.playerDead = false;
            setTeamBackground();
        }

        // Either show or hide the switch lane button
        // Can only be alled by a unity event, not on client side
        function handleGamePlayerNearBaseEvent(data) {
            if (data.nearBase === 0) {
                $scope.nearBase = false;
            } else {
                $scope.nearBase = true;
            }
        }

        // handle the game state changing to game over
        function handleGameStateUpdate(data){
            if(data.state === 2) {
                // winner, 1 is blue , 0 is red
                $scope.gameOver = true;  
                $scope.winnerTeam = data.winner === 0 ? "Red Team" : "Blue Team";
                $scope.winner = data.winner;
            } else if(data.state == 1) {
                // game player, remove the game over thing
                $scope.gameOver = false;  
            }           
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

        // When called, will reduced the time to respawn by 1 each second
        // will clear itself when it gets to 0 BUT not call the respawn, this only on the server's command
        function respawnTimerUpdate() {
            $scope.timeToRespawn = $scope.timeToRespawn - 1;
            if ($scope.timeToRespawn <= 0) {
                $interval.cancel(respawnTimer);
                console.log("respawn timer is done");
            }
        }

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