angular.module('gameView', ['ngRoute'])
    .controller('GameCtrl', ['$scope', "NetworkService", "UserService", "$interval",
        "SpecialPowerManagerService", "$rootScope", "toastr", 'GameInfoService', 'LocationService',
        function ($scope, NetworkService, UserService, $interval, SpecialPowerManagerService, $rootScope, toastr, GameInfoService, LocationService) {

            $scope.teamClass = UserService.getUserTeam();
            $scope.teamClassCSS = "blue-team";
            $scope.nearBase = false;
            $scope.playerDead = false;
            $scope.playerLevel = 1;
            $scope.timeToRespawn = 10;
            $scope.gameOver = false;
            $scope.winner = "";
            $scope.winnerTeam = "";
            $scope.specialPowers = UserService.getSpecialPowers();
            $scope.playerLane = UserService.getLane();
            $scope.classImageUrl = "";

            var respawnTimer; // TODO put this into a timer service
            var respawnTime = $scope.timeToRespawn;

            var healthChangeVibrateTime = 100;
            var deathVibrateTime = 1000;
            var respawnVibrateTime = 1000;

            var switchButton = document.getElementById('switch-button');
            var mainContainer = document.getElementById('main-container');

            // Catch and prevent long presses when users are pressing buttons
            window.oncontextmenu = function (event) {
                console.log("Prevented long press");
                event.preventDefault();
                event.stopPropagation();
                return false;
            };

            setup();

            /*
                Registering for events from the server
            */

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

            NetworkService.registerListener({
                eventName: "gamePlayerChangeHealth",
                call: handleGamePlayerChangeHealth
            });

            NetworkService.registerListener({
                eventName: "gamePlayerLevelUp",
                call: handleGamePlayerLevelUp
            });

            NetworkService.registerListener({
                eventName: "gamePlayerSwitchLane",
                call: handleGamePlayerSwitchLane
            });


            /*
                Attach event listeners to page to handle touches to both the canvas and other UI elements
                Touch events captured here are emitted on the root scope as a communication channel
                Other components (joystick) can then listen to the root scope and act when an event occurs
    
                This allows for multitouch of the joytick and specials at the same time
            */

            mainContainer.addEventListener('touchstart', function (e) {

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
                        specialUsed(touchedElementId);
                    } else if (touchedElementId === "stats-button") {
                        LocationService.setPath('/stats');
                    }
                }
            });

            // Direct ng-click event
            $scope.useSpecial = function (special) {
                specialUsed(special.id.toString());
            };

            // Do events with that special, tell server it has happened
            function specialUsed(touchedID) {
                var specialListNum = Number(touchedID.substring(touchedID.length - 1, touchedID.length));
                var special = $scope.specialPowers[specialListNum];
                if ($scope.specialPowers[specialListNum].enabled) {
                    $scope.specialPowers[specialListNum].enabled = false;
                    $scope.$apply();
                    SpecialPowerManagerService.specialButtonUsed($scope.specialPowers[specialListNum], specialListNum);
                }

            }

            // Move the user to the stats page
            $scope.viewStats = function () {
                console.log("sats");
                LocationService.setPath('/stats');
            };

            // Called when The player has died on the server, Change to the respawn screen and start the respawn timer
            // The timeleft is the time from now until when they should respawn (timestamp sent by the server)
            function handleGamePlayerDied(data) {
                // Set and start the the respawn timer 
                if(!$scope.playerDead){
                    $interval.cancel(respawnTimer);
                    respawnTimer = $interval(respawnTimerUpdate, 1000);
                }
                $scope.playerDead = true;

                // show the respawn screen
                $scope.teamClassCSS = "dead-team";
                $scope.timeToRespawn = respawnTime; // should be timeleft
                vibrate(deathVibrateTime);
            }

            // Sent from the server when the player respawns in the game, starts the respawn process
            function handleGamePlayerRespawn(data) {
                console.log("Player respawned on the server");
                $scope.timeToRespawn = "Now";
                $scope.playerDead = false;
                vibrate(respawnVibrateTime);
                setup();
            }

            // handle the game state changing to game over
            function handleGameStateUpdate(data) {
                // Handle game over, set winner
                if (data.state === 2) {
                    // winner, 1 is blue , 0 is red       
                    $scope.gameOver = true;
                    $scope.winnerTeam = data.winner === 0 ? "VIKINGS" : "COWBOYS";

                    // check if user is in the winning team and set background color as required
                    if ($scope.teamClass === 'red-team') {
                        if (data.winner === 0) {
                            // user is in the winner
                            $scope.winner = true;
                            $scope.wonOrLost = "Won!";
                        } else {
                            // not the winner
                            $scope.winner = false;
                            $scope.wonOrLost = "Lost!";
                        }
                    } else {
                        if (data.winner === 0) {
                            // user is in the winner
                            $scope.winner = false;
                            $scope.wonOrLost = "Lost!";
                        } else {
                            // not the winner
                            $scope.winner = true;
                            $scope.wonOrLost = "Won!";

                        }
                    }

                } else if (data.state === 1) {
                    // game not playing game, remove the game over div
                    $scope.gameOver = false;
                }
            }

            // Vibrate the game pad, the joystick handles the actual health change
            function handleGamePlayerChangeHealth(data) {
                vibrate(healthChangeVibrateTime);
            }

            function handleGamePlayerLevelUp(data) {
                console.log("Player leveled up" + data.level);
                $scope.playerLevel = data.level;
                toastr.success('LEVEL UP!');
            }

            function handleGamePlayerSwitchLane(data) {
                console.log("lane switch");
                $scope.playerLane = data.lane;
            }

            /*
                Helper functions 
            */

            // Vibrate the phone 
            function vibrate(time) {
                if (window.navigator.vibrate !== undefined) {
                    window.navigator.vibrate(100);
                } else {
                    // no vibrate, do nothing, sucks for iOS
                }
            }

            function setTeamClassHatImage() {

            }

            // Change the background colour of the container to the teams colours
            // Set the container to fill screen size
            function setup() {
                var colors = UserService.getTeamColor();

                var mainContainer = document.getElementById('main-container');
                var statsContainer = document.getElementById('stats-container');
                var container = document.getElementById('game-container');

                statsContainer.style.backgroundColor = colors.dark;

                if ($scope.teamClass === "blue-team") {
                    $scope.teamClassCSS = "blue-team";
                    container.style.backgroundImage = 'url("/resources/images/backgrounds/blue_game_back.jpg")';
                } else {
                    $scope.teamClassCSS = "red-team";
                    container.style.backgroundImage = 'url("/resources/images/backgrounds/red_game_back.jpg")';
                }

                container.style.height = "100%";
                container.style.top = "0px";

                // Set the class image
                var classNo = UserService.getHeroClass();
                var classBasePath = "/resources/images/hats/";
                if (classNo === 0) {
                    $scope.classImageUrl = classBasePath + "hunter_circle_small.png";
                } else if (classNo === 1) {
                    $scope.classImageUrl = classBasePath + "hitman_circle_small.png";
                } else if (classNo === 2) {
                    $scope.classImageUrl = classBasePath + "healer_circle_small.png";
                } else {
                    $scope.classImageUrl = classBasePath + "hardhat_circle_small.png";
                }
            }

            // When called, will reduced the time to respawn by 1 each second
            // will clear itself when it gets to 0 BUT not call the respawn, this only on the server's command
            function respawnTimerUpdate() {
                if ($scope.timeToRespawn <= 0) {
                    $interval.cancel(respawnTimer);
                    console.log("respawn timer is done");
                } else {
                    $scope.timeToRespawn = $scope.timeToRespawn - 1;
                }
            }

        }]);
