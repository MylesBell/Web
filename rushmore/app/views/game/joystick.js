angular.module('gameView')
    .controller('JoystickController', ['$scope', 'InputHandlerService', "NetworkService", "UserService", "$interval", "SpecialPowerManagerService", function($scope, InputHandlerService, NetworkService, UserService, $interval, SpecialPowerManagerService) {

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


        /*
            Canvas Setup            
        */

        // get canvas from DOM
        var canvas = document.getElementById('joystick-canvas');
        var ctx = canvas.getContext("2d");

        var centerX;
        var centerY;

        // Make it visually fill the positioned parent
        canvas.style.width = '90%';
        canvas.style.height = '90%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Get the center coords of the canvas
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;

        // Size of the control knob
        var joystickRadius = 25;
        // Radius of the control pad
        var padRadius = centerX;
        // Radius of the deadzone in center
        var deadZoneRadius = 40;

        // The movement arc currently selected
        var movementDirection = -1;

        var id; // the animation frame
        var animate = false; // whether to be animating or not

        // The joystick object, storing it's positon information in the pad
        var joystick = {
            width: joystickRadius * 2,
            height: joystickRadius * 2,
            x: (centerX - joystickRadius),
            y: (centerY - joystickRadius),
            enabled: false, // whether to draw it or not
            distToCenter: 0
        };

        // Draw the pad initally on the canvas
        drawPad();

        /*
            Bind mouse and touch event listeners
        */

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


        /*
            Update Fuctions
                Update the joystick location from the mouse or touch events
        */

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

        // stop aniamtion, hide the control knob and remove movement event listeners
        function stopKnobUpdate() {
            canvas.removeEventListener("mousemove", updateKnobPostion);
            canvas.removeEventListener("touchmove", updateKnobPostion);
            animate = false;
            joystick.enabled = false;
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
                console.log(newMoveDir);
                movDir = newMoveDir;
                $scope.inputButtonClicked(movDir);
            } else if (movDir !== newMoveDir && newMoveDir === -1) {
                // console.log("dead zone");
                movDir = newMoveDir;
                if (newMoveDir === -1) {
                    console.log("dead zone");
                }
                $scope.inputButtonClicked(movDir);
            }

            return movDir;
        }

        /*
            Animation functions
                Either update the postion of the knob in the pad from the touch events
                Or draw the new position and state of the pad
        */

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
                requestAnimationFrame(draw);
            }
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

            // var startAngleRad = (startingAngle) * (Math.PI / 180);

            // the start and end drawing angles
            var startAngleRad = radOffset;
            var endAngleRad = (startAngleRad + (arcAngle * (Math.PI / 180)));

            var newMovement = -1;

            // Draw the movement pads, colour the one the touch is in
            // Also set the movement direction to the currently highlighted pad
            for (var i = 0; i < 8; i++) {


                // if the knob is inside the movements arcs, outside deadzone and enabled
                if (angleToOrigin >= startAngleRad && angleToOrigin <= endAngleRad && joystick.distToOrigin > deadZoneRadius && joystick.enabled) {
                    ctx.fillStyle = "red";
                    // set movement direction
                    newMovement = i;
                } else {
                    ctx.fillStyle = "white";
                }

                // Draw the outer arc radius
                ctx.lineWidth = 2;
                ctx.beginPath(0);
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, padRadius, startAngleRad, endAngleRad);
                ctx.moveTo(centerX, centerY);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Update start and end to draw new rad by arcAngleRad
                var temp = startAngleRad;
                startAngleRad = endAngleRad % (Math.PI * 2);
                endAngleRad = (endAngleRad + arcAngleRad);
            }

            // Update the movement direction if required
            movementDirection = updateMovement(movementDirection, newMovement);

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