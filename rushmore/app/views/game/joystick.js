angular.module('gameView')
    .controller('JoystickController', ['$scope', 'InputHandlerService', "NetworkService", "UserService", "$rootScope", function ($scope, InputHandlerService, NetworkService, UserService, $rootScope) {

        //  Fired when user selects input button on game controller page
        // input can be one of several driections or powers, sends this input to the server
        // TODO rename this function to movement changed
        $scope.inputButtonClicked = function (direction) {
            InputHandlerService.handleInput({
                direction: direction
            }).catch(function (res) { });
        };

        /*
            Listen to network events 
        */
        NetworkService.registerListener({
            eventName: "gamePlayerChangeHealth",
            call: handleGamePlayerChangeHealth
        });

        NetworkService.registerListener({
            eventName: "gamePlayerRespawn",
            call: handleGamePlayerRespawn
        });

        NetworkService.registerListener({
            eventName: "gameBaseChangeHealth",
            call: handleGameBaseChangeHealth
        });

        NetworkService.registerListener({
            eventName: "gameStateUpdate",
            call: handleGameStateUpdate
        });

        /*
            Canvas Setup            
        */

        // get canvas from DOM
        var canvas = document.getElementById('joystick-canvas');
        var ctx = canvas.getContext("2d");

        var centerX;
        var centerY;

        // Size of the control knob
        var joystickRadius = 30;
        // Radius of the control pad
        var padRadius;
        // Radius of the deadzone in center
        var deadZoneRadius = 40;

        // The movement arc currently selected
        var movementDirection = -1;

        var id; // the animation frame
        var animate = false; // whether to be animating or not

        // Health as told by the server
        var currentHealth;
        var maxHealth;
        var playerHealthLostRad = 0.0001; // number of rads removed from the semi circle of health i.e 45 degress is 75% health
        var baseHealthLostRad = 0.0001;

        // element on the gameback, to move around while the controller moves
        var background = document.getElementById('game-container');

        // set the colours
        var teamColors = UserService.getTeamColor();
        var primaryColor = teamColors.primary;
        var highlightColor = teamColors.highlight;
        var darkColor = teamColors.dark;
        var playerHealthColorLost = teamColors.health.player.lost;

        var baseHealthColorReamining;
        var baseHealthColorLost;

        // spacing to put in own and base health icon
        var icon_offset_angle = 0.2;

        // The base and player health images, need loading callbacks to check they are loaded
        var baseImageObj = new Image();
        var baseImageObjLoaded = false;
        var baseImageWidth = 25;
        var userImageObj = new Image();
        var userImageObjLoaded = false;
        var userImageWidth = 30;

        if (UserService.getUserTeam() === 'red-team') {
            baseImageObj.src = "../../resources/images/base_health_icon_red.png";
        } else {
            baseImageObj.src = "../../resources/images/base_health_icon_blue.png";
        }

        // Load the images and redraw the canvas when done
        baseImageObj.onload = function () {
            baseImageObjLoaded = true;
            resizeCanvas();
        };
        userImageObj.src = "../../resources/images/user_health_icon.png";
        userImageObj.onload = function () {
            userImageObjLoaded = true;
            resizeCanvas();
        };

        // The joystick object, storing it's positon information in the pad
        var joystick = {
            width: joystickRadius * 2,
            height: joystickRadius * 2,
            x: (centerX - joystickRadius), // center of the cirlce not the top left
            y: (centerY - joystickRadius), // center not the top
            distToCenter: 0, // disatnce from the center of the pad
            down: false // whether it is currently selected or not
        };

        resizeCanvas();


        /*
            Bind mouse and touch event listeners
        */

        // Listen to events from the root scope
        // this is from the game controller when a touch start occurs
        // rootscope allows communiation between controllers effectivly
        $rootScope.$on("canvas.touch.start", function (e, args) {
            handleTouchStart(args);
        });

        function handleTouchStart(event) {
            // update the knob position to touch postion
            animate = true;
            updateKnobPostion(event);
            canvas.addEventListener("touchmove", updateKnobPostion);

            // Start the drawing loop for elemnents on the canvas 
            id = window.requestAnimationFrame(draw);
        }

        // Bind event for user letting go of knob with mouse
        // stop the updating of the canvas and remove movement event listener
        canvas.addEventListener("mouseup", function (e) {
            stopKnobUpdate();
        });

        // Bind event for user letting go of knob with mouse
        // stop the updating of the canvas and remove movement event listener
        canvas.addEventListener("touchend", function (e) {
            stopKnobUpdate();
        });

        // Redraw the canvas when the window is resize, for example when going into fullscreen
        window.addEventListener("resize", resizeCanvas);

        function handleGamePlayerChangeHealth(data) {
            // get fraction of health remaining
            var remainingHealthRatio = (data.playerHealth / data.maxHealth);

            // how many rads is removed from the health using remaining ratio
            // add small delta to lost is not 0, and will not draw a ring
            playerHealthLostRad = toRadians(180 * (1 - remainingHealthRatio)) + 0.002;

            // Handle the health ring wrapping round on low health
            if (playerHealthLostRad > 179) {
                playerHealthLostRad = 179;
            }

            //update the whole canvas with updated health ring
            updateAll();
        }

        // Sent from the server when the player respawns in the game, starts the respawn process
        function handleGamePlayerRespawn(data) {
            console.log("Player respawned on the server");
            handleGamePlayerChangeHealth({
                playerHealth: 1000, // TODO make this not constant
                maxHealth: 1000
            });
        }

        function handleGameBaseChangeHealth(data) {
            // get fraction of health remaining
            var remainingHealthRatio = (data.currentBaseHealth / data.maxBaseHealth);

            // how many rads is removed from the health using remaining ratio
            baseHealthLostRad = toRadians(180 * (1 - remainingHealthRatio)) + 0.002;

            // Handle the health ring wrapping round on low health
            if (baseHealthLostRad > 179) {
                baseHealthLostRad = 179;
            }

            //update the whole canvas with updated health ring
            updateAll();
        }

        // If the game end, then reset the base health to max to prepare for the game restarting
        function handleGameStateUpdate(data) {
            if (data.state === 2) {
                handleGameBaseChangeHealth({ currentBaseHealth: 1, maxBaseHealth: 1 });
            }
        }

        /*
            Update Fuctions
                Update the joystick location from the mouse or touch events
        */

        function resizeCanvas() {

            // Make it visually fill the positioned parent
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            // ...then set the internal size to match
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            // Get the center coords of the canvas
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;

            // scale pad radius from center
            padRadius = centerX * 0.85;


            // Handle the canvas being wider than it is tall (i.e landscape mode)
            if (padRadius > (canvas.height / 2)) {
                console.log("canvas too big, resizing");
                padRadius = (canvas.height / 2) - joystickRadius / 2;
            }

            // Draw all stuff on the campus
            updateAll();

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

            // Only draw if inside the pad
            if (joystickDisp > padRadius) { } else {
                joystick.x = newX;
                joystick.y = newY;
                joystick.down = true;
            }

        }

        // stop aniamtion, hide the control knob and remove movement event listeners
        function stopKnobUpdate() {
            canvas.removeEventListener("mousemove", updateKnobPostion);
            canvas.removeEventListener("touchmove", updateKnobPostion);
            animate = false;
            joystick.down = false;
            window.cancelAnimationFrame(id);
        }

        // get pointer pos from mouse event
        function getMousePos(rect, evt) {
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        // get pointer pos from touch event
        function getTouchPos(rect, evt) {
            return {
                x: evt.touches[0].clientX - rect.left,
                y: evt.touches[0].clientY - rect.top
            };
        }

        // Log and handle the movement postions of the knob
        // Send changes in the movement to the server
        function updateMovement(movDir, newMoveDir) {

            // Update the current movement to the arc selected
            // Check if the movement changed or stayed the same
            if (movDir === newMoveDir) {
                // still in same movement arc, send no event
            } else if (movDir !== newMoveDir && newMoveDir !== -1) {
                // moved knob to a new location
                movDir = newMoveDir;
                $scope.inputButtonClicked(movDir);

                var backgroundPos = [['30%', '0%'], ['10%', '10%'], ['0%', '30%'], ['-10%', '10%'], ['-30%', '0%'], ['-10%', '-10%'],['0%', '-30%'], ['10%', '-10%']];
                // console.log(movDir);
                // move the background around
                // background.style.backgroundPositionX = backgroundPos[movDir][0];
                // background.style.backgroundPositionY = backgroundPos[movDir][1];

            } else if (movDir !== newMoveDir && newMoveDir === -1) {
                // dead zone
                movDir = newMoveDir;
                $scope.inputButtonClicked(movDir);
                background.style.backgroundPositionX = "0%";
                background.style.backgroundPositionY = "0%";
            }

            return movDir;
        }

        function toRadians(degrees) {
            return degrees * (Math.PI / 180);
        }

        /*
            Animation functions
                Either update the postion of the knob in the pad from the touch events
                Or draw the new position and state of the pad
        */

        // Draw all the elements to the screen
        function draw() {

            updateAll();

            if (animate) {
                requestAnimationFrame(draw);
            }
        }

        function updateAll() {
            // clear the canvas of any elemnt
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the pad, movement zones, knob and health
            drawPad();
            drawPlayerHealthRing();
            drawKnob();
        }

        function drawKnob() {
            ctx.fillStyle = darkColor;
            ctx.strokeStyle = darkColor;
            ctx.lineWidth = 0;

            // Draw the knob
            if (joystick.down) {
                ctx.beginPath();
                ctx.arc(joystick.x + joystickRadius, joystick.y + joystickRadius, joystickRadius, 0, Math.PI * 2, true); // joystick knob
                ctx.stroke();
                ctx.fill();
            } else {
                // draw knob in center if not currently selected
                ctx.beginPath();
                ctx.arc(centerX, centerY, joystickRadius, 0, Math.PI * 2, true); // joystick knob
                ctx.stroke();
                ctx.fill();
            }
        }

        // Draw the current players and base's health as a ring around the control pad
        function drawPlayerHealthRing() {

            var playerHealthRingLength = playerHealthLostRad + icon_offset_angle;
            var baseHealthRingLength = baseHealthLostRad + icon_offset_angle;

            // Prevent the bar wrapping round
            if (playerHealthRingLength > 3.13) {
                playerHealthRingLength = 3.14;
            }

            if (baseHealthRingLength > 3.13) {
                baseHealthRingLength = 3.14;
            }

            // caluclate the size of health ring to draw based on the health lost
            // get angle from the top (270 degree) position
            var startAngle = ((3 / 2) * Math.PI) + playerHealthRingLength;
            var endAngle = ((3 / 2) * Math.PI) - playerHealthRingLength;

            ctx.fillStyle = teamColors.health.player.remaining;
            ctx.strokeStyle = teamColors.health.player.remaining;
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.arc(centerX, centerY, padRadius * 0.85, endAngle, startAngle, true);
            ctx.stroke();
            ctx.drawImage(userImageObj, centerX - userImageWidth / 2, (centerY - padRadius * 0.86) - userImageWidth / 2, userImageWidth, userImageWidth);

            startAngle = ((3 / 2) * Math.PI) + baseHealthRingLength;
            endAngle = ((3 / 2) * Math.PI) - baseHealthRingLength;
            ctx.strokeStyle = teamColors.health.base.remaining;
            ctx.fillStyle = teamColors.health.base.remaining;
            ctx.beginPath();
            ctx.arc(centerX, centerY, padRadius * 0.65, endAngle, startAngle, true);
            ctx.stroke();
            ctx.drawImage(baseImageObj, centerX - baseImageWidth / 2, (centerY - padRadius * 0.65) - baseImageWidth / 2, baseImageWidth, baseImageWidth);
        }

        // Draw the control pad with the sectors for movement
        function drawPad() {

            // get which pad the knob is in
            // get angle from point to hoiztonal and compare to the arc of each the pad zone
            var deltaX = joystick.x + joystickRadius - centerX;
            var deltaY = joystick.y + joystickRadius - centerY;
            var angleToOrigin = Math.atan2(deltaY, deltaX);

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

            // the start and end drawing angles
            var startAngleRad = radOffset;
            var endAngleRad = (startAngleRad + (arcAngle * (Math.PI / 180)));

            var newMovement = -1;

            // Draw the movement pads, colour the one the touch is in
            // Also set the movement direction to the currently highlighted pad
            for (var i = 0; i < 8; i++) {
                // if the knob is outside deadzone and enabled, allowed to be outside the pad (user feedback)
                if (angleToOrigin >= startAngleRad && angleToOrigin <= endAngleRad && joystick.distToOrigin > deadZoneRadius && joystick.down) {
                    ctx.fillStyle = "#ECECEC";
                    ctx.strokeStyle = "#ECECEC";

                    // set movement direction using what section of the circle we are in
                    newMovement = i;
                } else {
                    ctx.fillStyle = "white";
                    ctx.strokeStyle = "white";
                }

                // Draw the outer arc radius
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, padRadius, startAngleRad, endAngleRad);
                ctx.moveTo(centerX, centerY);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();

                // Update start and end to draw new rad by arcAngleRad
                var temp = startAngleRad;
                startAngleRad = endAngleRad % (Math.PI * 2);
                endAngleRad = (endAngleRad + arcAngleRad);
            }

            // Update the movement direction if required
            movementDirection = updateMovement(movementDirection, newMovement);

            // Draw the deadzone             
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";

            ctx.lineWidth = 1;

            ctx.beginPath(0);
            ctx.arc(centerX, centerY, deadZoneRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.lineWidth = 1;
        }

    }]);
