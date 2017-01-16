var gridCoordinates = [];
var bDots = [];
var playable = true;
var touches;
var fps;

function BouncingDot(x, y, rSize, selectioncolor, index) {
    // Object definition and code
    this.rS = rSize;
    this.x = x;
    this.y = y;
    this.radius = rSize * 0.7;
    this.isExpanding = true;
    this.enabled = true;
    this.color = selectioncolor; //getRandomColor();
    this.update = function (){
        var radiusSize;
        var r1 = parseInt((window.innerWidth * 2 / 3) / 1.5);
        var r2 = parseInt((window.innerHeight * 2 / 3) / 2.5);
        if (r1 < r2)
            radiusSize = r1;
        else
            radiusSize = r2;

        if (this.isExpanding)
            this.radius += 0.02 / 1 * radiusSize / fps * 50;
        else
            this.radius -= 0.02 / 1 * radiusSize / fps * 50;

        if (this.radius >= this.rS) {
            this.isExpanding = false;
        }
        if (this.radius <= 0) {
            this.enabled = false;
            if (extAudio[index].error==undefined && !extAudio[index].ended && extAudio[index].src!="" && extAudio[index].src!=undefined) {
                var coordX = parseInt(gridCoordinates[index].split(",")[0]);
                var coordY = parseInt(gridCoordinates[index].split(",")[1]);
                bDots.push(new BouncingDot(coordX, coordY, radiusSize, getColor(index), index));
            } else {
                Materialize.toast("No ext @ " + index, 4000);
            }
        }
    };
}

function isBouncingDotEmpty(x, y) {
    var res = true;
    if (bDots != null) {
        bDots.forEach(function (item, index, array) {
            var dot = item;
            if (dot.enabled == true && Math.round(dot.x - x) == 0 && Math.round(dot.y - y) == 0) {
                res = false;
            }
        });
    }
    return res;
}

function getColor(i) {
	return "#555555";
}

function repaint() {
    // Set up the canvas variables
	document.getElementById("container").height = (window.innerHeight);
	document.getElementById("container").width = (window.innerWidth);
    /* Set Up Canvas */	var canvas = document.getElementById('container');
    /* Set Up Canvas */	var ctx = canvas.getContext('2d');
	/* Set Up Canvas */ var drawHH = canvas.height;
	/* Set Up Canvas */ var drawWW = canvas.width;

    // Clear the canvas
    /* Clear Canvas */	ctx.fillStyle = '#FFFFFF';
    /* Clear Canvas */	ctx.fillRect(0, 0, drawWW, drawHH);
	/* Clear Canvas */	var backgroundI = new Image();
	/* Clear Canvas */	backgroundI.src = "images/stripes.png";
	/* Clear Canvas */	for (var bX = 0; bX <= drawWW / 51 + 1; bX++)
	/* Clear Canvas */		for (var bY = 0; bY <= drawHH / 51 + 1; bY++)
	/* Clear Canvas */			ctx.drawImage(backgroundI, bX * 51, bY * 51);

    // Render the canvas dotted background
    var bgColor = "#000000";
    /* Background */	// Get the smallest radius circle that will fit in all circles
    /* Background */	ctx.fillStyle = bgColor;
    /* Background */	var radiusSize;
    /* Background */	var r1 = parseInt((drawWW * 2 / 3) / 2);
    /* Background */	var r2 = parseInt((drawHH * 2 / 3) / 4);
    /* Background */	if (r1 < r2)
    /* Background */		radiusSize = r1;
    /* Background */	else
    /* Background */		radiusSize = r2;
    /* Background */	// Render circles row by row
    /* Background */	var offsetX = (drawWW - 3 / 52 * radiusSize) / 2;
    /* Background */	var offsetY = (drawHH -  5 * radiusSize + 10) / 2;
    /* Background */	// Top Row
    /* Background */	for (var trc = 0; trc < 1; trc++) {
    /* Background */		ctx.fillStyle = bgColor;
    ctx.fillStyle = "#AAAAAA";
    /* Background */		var centerX = offsetX;
    /* Background */		var centerY = offsetY + radiusSize;
    /* Background */		ctx.beginPath();
    /* Background */		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */		ctx.fill();
    /* Background */		ctx.lineWidth = 5;
    /* Background */		ctx.strokeStyle = '#FFFFFF';
    /* Background */		ctx.stroke();
    /* Background */		ctx.fillStyle = "#FFFFFF";
    /* Background */		ctx.font = (radiusSize * 2 / 3) + "px Arial"
    /* Background */		ctx.fillText(3 + trc, centerX - 0.5 * radiusSize, centerY - 0.25 * radiusSize);
    /* Background */		gridCoordinates[3 + trc] = centerX + "," + centerY;
    /* Background */	}
    /* Background */	// Second Row
    /* Background */	for (var trc = 0; trc < 1; trc++) {
    /* Background */		ctx.fillStyle = bgColor;
    ctx.fillStyle = "#AAAAAA";
    /* Background */		var centerX = offsetX;
    /* Background */		var centerY = offsetY + radiusSize * 7 / 3 ;
    /* Background */		ctx.beginPath();
    /* Background */		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */		ctx.fill();
    /* Background */		ctx.lineWidth = 5;
    /* Background */		ctx.strokeStyle = '#FFFFFF';
    /* Background */		ctx.stroke();
    /* Background */		ctx.fillStyle = "#FFFFFF";
    /* Background */		ctx.font = (radiusSize * 2 / 3) + "px Arial"
    /* Background */		ctx.fillText(2 + trc, centerX - 0.5 * radiusSize, centerY - 0.25 * radiusSize);
    /* Background */		gridCoordinates[2 + trc] = centerX + "," + centerY;
    /* Background */	}
    // Third Row
    /* Background */	for (var trc = 0; trc < 1; trc++) {
    /* Background */		ctx.fillStyle = bgColor;
    ctx.fillStyle = "#AAAAAA";
    /* Background */		var centerX = offsetX;
    /* Background */		var centerY = offsetY + radiusSize * 11 / 3 ;
    /* Background */		ctx.beginPath();
    /* Background */		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */		ctx.fill();
    /* Background */		ctx.lineWidth = 5;
    /* Background */		ctx.strokeStyle = '#FFFFFF';
    /* Background */		ctx.stroke();
    /* Background */		ctx.fillStyle = "#FFFFFF";
    /* Background */		ctx.font = (radiusSize * 2 / 3) + "px Arial"
    /* Background */		ctx.fillText(1 + trc, centerX - 0.5 * radiusSize, centerY - 0.25 * radiusSize);
    /* Background */		gridCoordinates[1 + trc] = centerX + "," + centerY;
    /* Background */	}

    // Render each bouncing dot
    /* Render bDot */	if (bDots != null) {
    /* Render bDot */		bDots.forEach(function (item, index, array) {
    /* Render bDot */			var dot = item;
    /* Render bDot */			if (dot.enabled) {
    /* Render bDot */				ctx.fillStyle = dot.color;
    /* Render bDot */				var dbX = dot.x;
    /* Render bDot */				var dbY = dot.y;
    /* Render bDot */				var dbR = dot.radius;
    /* Render bDot */				ctx.beginPath();
    /* Render bDot */				ctx.arc(dbX, dbY, dbR, 0, 2 * Math.PI, false);
    /* Render bDot */				ctx.fill();
    /* Render bDot */			}
    /* Render bDot */		});
    /* Render bDot */	}

    refresh(false, null);
    // Schedule the next repaint method for smooth fps
    window.requestAnimationFrame(repaint);
    requestAnimFrame();
}

var lastCalledTime;

function requestAnimFrame() {
	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
		return;
	}
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1 / delta;
}

function refresh(interval, ttouches, mouseX, mouseY) {
    if (ttouches!=null) touches = ttouches;

    // Some minor background calculations
    /* Set Up Canvas */	var canvas = document.getElementById('container');
	/* Set Up Canvas */ var drawHH = canvas.height;
	/* Set Up Canvas */ var drawWW = canvas.width;
    /* Background */	// Get the smallest radius circle that will fit in all circles
    /* Background */	var radiusSize;
    /* Background */	var r1 = parseInt((drawWW * 2 / 3) / 2);
    /* Background */	var r2 = parseInt((drawHH * 2 / 3) / 4);
    /* Background */	if (r1 < r2)
    /* Background */		radiusSize = r1;
    /* Background */	else
    /* Background */		radiusSize = r2;

    // Update the bouncing dot size, including destroying dots too small
    /* Update bDot */	if (bDots != null) {
    /* Update bDot */		bDots.forEach(function (item, index, array) {
    /* Update bDot */			var dot = item;
    /* Update bDot */			if (dot.enabled) {
    /* Update bDot */				dot.update();
    /* Update bDot */			}
    /* Update bDot */		});
    /* Update bDot */	}

    /* Add Dots */		gridCoordinates.forEach(function (item, index, array) {
    /* Add Dots */			var dD = Math.round(0.6 * radiusSize);
	/* Add Dots */			// Get the grid X and grid Y from splitting the string
    /* Add Dots */			var coord = item.split(",");
    /* Add Dots */			var coordX = coord[0];
    /* Add Dots */			var coordY = coord[1];
    /* Add Dots */			// Touch coordinates
    /* Add Dots */			if (touches != null) {
    /* Add Dots */				for (var TI = 0; TI < touches.length; TI++) {
    /* Add Dots */					var touch = touches[TI];
    /* Add Dots */					dX = Math.round(touch.clientX / 1) - Math.round(coordX);
    /* Add Dots */					dY = Math.round(touch.clientY / 1) - Math.round(coordY);
    /* Add Dots */					// Distance formula
    /* Add Dots */					if (dD * dD >= (dX * dX + dY * dY)) {
    /* Add Dots */						// Add a bouncing dot if a bouncing dot does not exist at the grid location.
    /* Add Dots */						// Duplicate below code to further below touch point add bouncing dot code upon edit.
    /* Add Dots */						if (isBouncingDotEmpty(coordX, coordY)) {
                                  bDots.push(new BouncingDot(coordX, coordY, radiusSize, getColor(index), index));
                                  extAudio[index].play();
                                  //console.log(index);
                              }
    /* Add Dots */					}
    /* Add Dots */				}
    /* Add Dots */			} else {
    /* Add Dots *				// Mouse coordinates
    /* Add Dots */				var dX = mouseX / 1 - Math.round(coordX);
    /* Add Dots */				var dY = mouseY / 1 - Math.round(coordY);
    /* Add Dots */				// Distance formula
    /* Add Dots */				if (dD * dD >= (dX * dX + dY * dY)) {
    /* Add Dots */					// Add a bouncing dot if a bouncing dot does not exist at the grid location.
    /* Add Dots */					// This code should match the above code.
    /* Add Dots */					if (isBouncingDotEmpty(coordX, coordY)) {
                                bDots.push(new BouncingDot(coordX, coordY, radiusSize, getColor(index), index));
                                extAudio[index].play();
                                //console.log(index);
                            }
    /* Add Dots */				}
	/* Add Dots */			}
    /* Add Dots */		});

    // Schedule the next refresh method for smooth fps
    /* Schedule Next */	if (interval) setTimeout(function (){refresh(true, null); }, 1000 / 100);
}

repaint();
refresh(true, null, 0, 0);

//This method helps update variables mouseX and mouseY for use in repaint();
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//Add event listener to the content canvas to update touch
container.addEventListener('touchstart', function(evt){
    evt.preventDefault();
    refresh(false, evt.targetTouches, 0, 0);
    touches = evt.targetTouches;
}, false);

//Add event listener to the content canvas to update touch
container.addEventListener('touchend', function(evt){
    evt.preventDefault();
    refresh(false, evt.targetTouches, 0, 0);
    touches = evt.targetTouches;
}, false);

//Add event listener to the content canvas to update mouse
container.addEventListener('mousedown', function(evt) {
    evt.preventDefault();
    var mousePos = getMousePos(container, evt);
    refresh(false, null, mousePos.x, mousePos.y);
}, false);

var extAudio = [];

// Load external audio tracks.
try {
    extAudio[1] = new Audio();
    extAudio[1].onerror = function() {
        //console.log("Error loading external audio 1");
    };
    if (localStorage.getItem("bitty.synth.ext1")!=null && localStorage.getItem("bitty.synth.ext1")!="" && localStorage.getItem("bitty.synth.ext1")!=undefined){
        extAudio[1].src = localStorage.getItem("bitty.synth.ext1");
        //console.log("Loaded ext audio 1. ");
    }
} catch (err) {

}

try {
    extAudio[2] = new Audio();
    extAudio[2].onerror = function() {
        //console.log("Error loading external audio 2");
    };
    if (localStorage.getItem("bitty.synth.ext2")!=null && localStorage.getItem("bitty.synth.ext2")!="" && localStorage.getItem("bitty.synth.ext2")!=undefined){
        extAudio[2].src = localStorage.getItem("bitty.synth.ext2");
        //console.log("Loaded ext audio 2. ");
    }
} catch (err) {

}

try {
    extAudio[3] = new Audio();
    extAudio[3].onerror = function() {
        //console.log("Error loading external audio 3");
    };
    if (localStorage.getItem("bitty.synth.ext3")!=null && localStorage.getItem("bitty.synth.ext3")!="" && localStorage.getItem("bitty.synth.ext3")!=undefined){
        extAudio[3].src = localStorage.getItem("bitty.synth.ext3");
        //console.log("Loaded ext audio 3. ");
    }
} catch (err) {

}
