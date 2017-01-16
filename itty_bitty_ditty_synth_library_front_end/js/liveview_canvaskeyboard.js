var gridCoordinates = []; 
var bDots = []; 
var playable = true; 
var touches; 
var fps; 

var canvasPlayer1 = new canvasplayback(1); 
var canvasPlayer2 = new canvasplayback(2); 
var canvasPlayer3 = new canvasplayback(3); 
var canvasPlayer4 = new canvasplayback(4); 
var canvasPlayer5 = new canvasplayback(5); 

function BouncingDot(x, y, rSize, selectioncolor) {
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
        var r1 = parseInt((window.innerWidth * 2 / 3) / 5); 
        var r2 = parseInt((window.innerHeight * 2 / 3) / 2); 
        if (r1 < r2) 
            radiusSize = r1; 
        else
            radiusSize = r2; 

        if (this.isExpanding)
            this.radius += 0.08 / 1 * radiusSize / fps * 50; 
        else
            this.radius -= 0.08 / 1 * radiusSize / fps * 50; 

        if (this.radius >= this.rS) {
            this.isExpanding = false; 
        }
        if (this.radius <= 0) {
            this.enabled = false; 
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
	switch (i){
		case 3: 
			return "#DC143C"; 
			break;
		case 4:
			return "#FF8C00"; 
			break;
		case 5:
			return "#483D8B";
			break; 
		case 1: 
			return "#00FFFF"; 
			break;
		case 2:
			return "#7FFF00"; 
			break;
	}
}

function repaint() {
    // Set up the canvas variables
	document.getElementById("container").height = (window.innerHeight - 250);
	if (!loadBooleanPreference(SETTINGS_LIVEVIEW_SHOW_FX_PANEL)) document.getElementById("container").height = window.innerHeight; 
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
    /* Background */	var r1 = parseInt((drawWW * 2 / 3) / 4); 
    /* Background */	var r2 = parseInt((drawHH * 2 / 3) / 3); 
    /* Background */	if (r1 < r2) 
    /* Background */		radiusSize = r1; 
    /* Background */	else
    /* Background */		radiusSize = r2; 
    /* Background */	// Render circles row by row
    /* Background */	var offsetX = (drawWW - (2 * radiusSize + 2 * radiusSize * 4 / 3)) / 2;
    /* Background */	var offsetY = (drawHH - (2 * radiusSize + 1 * radiusSize * 4 / 3)) / 2;
    /* Background */	// Top Row
    /* Background */	for (var trc = 0; trc < 3; trc++) {
    /* Background */		ctx.fillStyle = bgColor; 
    switch (3+trc){
    	case 3: 
    		ctx.fillStyle = "#D899A7"; 
    		break;
    	case 4:
    		ctx.fillStyle = "#FFC889"; 
    		break;
    	case 5:
    		ctx.fillStyle = "#E8E5FF";
    		break; 
    }
    /* Background */		var centerX = offsetX + radiusSize + trc * radiusSize * 4 / 3; 
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
    /* Background */	for (var trc = 0; trc < 2; trc++) {
    /* Background */		ctx.fillStyle = bgColor; 
    switch (1+trc){
		case 1: 
			ctx.fillStyle = "#C4FFFF"; 
			break;
		case 2:
			ctx.fillStyle = "#CAFF96"; 
			break;
    }
    /* Background */		var centerX = offsetX + 3.8 / 3 * radiusSize + 0.5 * radiusSize + trc * radiusSize * 4 / 3; 
    /* Background */		var centerY = offsetY + radiusSize * 7 / 3 ; 
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
    /* Background */	var r1 = parseInt((drawWW * 2 / 3) / 3); 
    /* Background */	var r2 = parseInt((drawHH * 2 / 3) / 2); 
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
    var canvasID = index; 
     
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
    	if (isBouncingDotEmpty(coordX, coordY)) { 
    		switch (canvasID){
				case 1: 
					canvasPlayer1.play(); 
					break;
				case 2:
					canvasPlayer2.play(); 
					break;
				case 3:
					canvasPlayer3.play(); 
					break;
				case 4:
					canvasPlayer4.play(); 
					break;
				case 5:
					canvasPlayer5.play(); 
					break; 
			}
    		bDots.push(new BouncingDot(coordX, coordY, radiusSize, getColor(index)));
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
    /* Add Dots */					
    	if (isBouncingDotEmpty(coordX, coordY)) { 
    		switch (canvasID){
				case 1: 
					canvasPlayer1.play(); 
					break;
				case 2:
					canvasPlayer2.play(); 
					break;
				case 3:
					canvasPlayer3.play(); 
					break;
				case 4:
					canvasPlayer4.play(); 
					break;
				case 5:
					canvasPlayer5.play(); 
					break; 
			}
    		bDots.push(new BouncingDot(coordX, coordY, radiusSize, getColor(index)));
    	}
    /* Add Dots */				}
	/* Add Dots */			}
    /* Add Dots */		});
    
    // Schedule the next refresh method for smooth fps
    /* Schedule Next */	if (interval) setTimeout(function (){refresh(true, null); }, 1000 / 100); 
}

repaint(); 

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