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
            var mainContainer = document.getElementById('main-container');
            if ($scope.teamClass === "blue-team") {
                mainContainer.className += " blue-team";
                $scope.teamClassCSS = "blue-team";
            } else {
                mainContainer.className += " red-team";
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
            handleSpecialClicked(specialNumber); // TODO made this generic to other special button
        };

        // // Enable click & dblclick events, and monitor both.
        // downButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        // downButton.addEventListener('tap', down, false);
        // downButton.addEventListener('dbltap', down, false);
        // upButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        // upButton.addEventListener('tap', up, false);
        // upButton.addEventListener('dbltap', up, false);
        // forwardButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        // forwardButton.addEventListener('tap', forward, false);
        // forwardButton.addEventListener('dbltap', forward, false);
        // backwardButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        // backwardButton.addEventListener('tap', backward, false);
        // backwardButton.addEventListener('dbltap', backward, false);
        // switchButton.addEventListener(HAS_TOUCH ? 'touchend' : 'mouseup', doubleTap(), false);
        // switchButton.addEventListener('tap', switchLane, false);
        // switchButton.addEventListener('dbltap', switchLane, false);


        var canvas = document.getElementById('joystick-canvas');
        var ctx = canvas.getContext("2d");

        var offsetX = canvas.offsetLeft;
        var offsetY = canvas.offsetTop;

        var centerX;
        var centerY;

        // Make it visually fill the positioned parent
        canvas.style.width = '90%';
        canvas.style.height = '90%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        centerX = canvas.width / 2;
        centerY = canvas.height / 2;

        var joystickRadius = 25;
        var padRadius = centerX;
        var deadZoneRadius = 40;

        var id; // the animation frame
        var animate = false;

        var joystick = {
            width: joystickRadius * 2,
            height: joystickRadius * 2,
            x: (centerX - joystickRadius),
            y: (centerY - joystickRadius),
            enabled: false,
            distToCenter: 0
        };


        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(centerX, centerY, padRadius, 0, Math.PI * 2, true); // Outer circle
        ctx.stroke();
        ctx.fill();

        ctx.fillRect(joystick.x, joystick.y, joystick.width, joystick.height);

        drawPad();

        // bind either touch or mouse events
        canvas.addEventListener("mousedown", function(e) {

            // Update the knob position to mouse postion
            animate = true;
            updateKnobPostion(e);
            canvas.addEventListener("mousemove", updateKnobPostion);

            // Start the drawing loop for elemnents on the canvas 
            id = window.requestAnimationFrame(draw);
        });

        // Bind touch events for mobile
        canvas.addEventListener("touchstart", function(e) {

            // update the knob position to touch postion
            animate = true;
            updateKnobPostion(e);
            canvas.addEventListener("touchmove", updateKnobPostion);

            // Start the drawing loop for elemnents on the canvas 
            id = window.requestAnimationFrame(draw);
        });

        // Bind event for user letting go of knob with mouse
        // stop the updating of the canvas and remove movement event listener
        canvas.addEventListener("mouseup", function(e) {
            stopKnobUpdate();
        });

        // Bind event for user letting go of knob with mouse
        // stop the updating of the canvas and remove movement event listener
        canvas.addEventListener("touchend", function(e) {
            stopKnobUpdate();
        });

        function stopKnobUpdate() {
            canvas.removeEventListener("mousemove", updateKnobPostion);
            canvas.removeEventListener("touchmove", updateKnobPostion);
            animate = false;
            joystick.enabled = false;
            window.cancelAnimationFrame(id);
        }

        // Update the postion of the knob to the touch or mouse down position
        function updateKnobPostion(e) {
            var pos;
            if (e.type === "touchmove" || e.type === "touchstart") {
                pos = getTouchPos(canvas.getBoundingClientRect(), e);
            } else {
                pos = getMousePos(canvas.getBoundingClientRect(), e);
            }

            var newX = pos.x - joystickRadius;
            var newY = pos.y - joystickRadius;

            // check if outside the pad circle area
            // given by r^2 = (x - x_c)^2 + (y - y_c)^2
            var joystickDisp = Math.sqrt(Math.pow((pos.x - centerX), 2) + Math.pow((pos.y - centerY), 2));

            joystick.distToOrigin = joystickDisp;
            joystick.enabled = true;

            // Only draw if inside the pad
            if (joystickDisp > padRadius) {

            } else {
                joystick.x = newX;
                joystick.y = newY;
            }
        }

        function getMousePos(rect, evt) {
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        function getTouchPos(rect, evt) {
            return {
                x: evt.touches[0].clientX - rect.left,
                y: evt.touches[0].clientY - rect.top
            };
        }

        // Draw all the elements to the screen
        function draw() {

            // clear the canvas of any elemnt
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the pad and movement zones
            drawPad();

            // Draw the knob
            if (joystick.enabled) {
                ctx.fillStyle = "black";
                ctx.strokeStyle = "black";
                ctx.beginPath();
                ctx.arc(joystick.x + joystickRadius, joystick.y + joystickRadius, joystickRadius, 0, Math.PI * 2, true); // joystick knob
                ctx.stroke();
                ctx.fill();
                // Draw line to knob from center of pad
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(joystick.x + joystickRadius, joystick.y + joystickRadius);
                ctx.stroke();
            }

            if (animate) {
                requestAnimationFrame(draw)
            };
        }

        // Draw the control pad with the sectors for movement
        function drawPad() {

            // Draw the pad
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.arc(centerX, centerY, centerX, 0, Math.PI * 2, true); // Outer circle
            ctx.stroke();
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";

            // get which pad the knob is in
            // get angle from point to hoiztonal and compare to the arc of each the pad zone
            var deltaX = joystick.x + joystickRadius - centerX;
            var deltaY = joystick.y + joystickRadius - centerY
            var angleToOrigin = Math.atan2(deltaY, deltaX);
            var distToOrigin

            // Handle either side of the x-axis, sorry about this future me
            if (angleToOrigin < 0) {
                angleToOrigin = ((Math.PI) - angleToOrigin * (-1)) + Math.PI;
            } // handle the top half of the circle, where the angle to origin is negaitve
            if (angleToOrigin > (337.5) * Math.PI / 180) {
                angleToOrigin = (337.5 - 360) * Math.PI / 180;
            } // to handle the negative starting arc of the east button

            /* 
                draw arcs on pad 
            */

            // The size of each arc 
            var arcAngle = 45;
            var arcAngleRad = arcAngle * (Math.PI / 180);

            var radOffset = (-22.5) * (Math.PI / 180);
            var startingAngle = 0;

            // var startAngleRad = (startingAngle) * (Math.PI / 180);

            // the start and end drawing angles
            var startAngleRad = radOffset;
            var endAngleRad = (startAngleRad + (arcAngle * (Math.PI / 180))) % (Math.PI * 2);

            // Draw the movement pads, colour the one the touch is in
            for (var i = 0; i < 8; i++) {

                if (angleToOrigin >= startAngleRad && angleToOrigin <= endAngleRad && joystick.distToOrigin > deadZoneRadius && joystick.enabled) {
                    ctx.fillStyle = "red";
                } else {
                    ctx.fillStyle = "white";
                }

                ctx.lineWidth = 2;
                ctx.beginPath(0);
                ctx.moveTo(centerX, centerY);

                ctx.arc(centerX, centerY, padRadius, startAngleRad, endAngleRad);
                ctx.moveTo(centerX, centerY);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                var temp = startAngleRad;
                startAngleRad = endAngleRad % (Math.PI * 2);
                endAngleRad = (endAngleRad + arcAngleRad) % (Math.PI * 2);
            }

            // Draw the deadzone             
            ctx.fillStyle = "white";

            ctx.beginPath(0);
            ctx.arc(centerX, centerY, deadZoneRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            ctx.lineWidth = 1;
        }



    }]);