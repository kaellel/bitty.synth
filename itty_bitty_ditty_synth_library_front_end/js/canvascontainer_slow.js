// Get the Canvas Number from URL information
// val: the property p in "canvas.html?p=x"
function parseURL(val) {
	var result = "Invalid Input Parameters",
		tmp = [];
	var items = location.search.substr(1).split("&");
	for (var index = 0; index < items.length; index++) {
		tmp = items[index].split("=");
		if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
	}
	return result;
}

// The canvas number is determined by the "?canvasn=value" in the URL
var canvasNumber = parseURL("canvasn"); 
var frameNumber = localStorage.getItem("bitty.synth.selectedFrameIndex");

document.getElementById('bottomFrame').src = "bottombar.html?canvasn=" + canvasNumber; 

window.addEventListener("resize", redraw, false); 

function redraw() {
	var contentContainer = document.getElementById('contentContainer'); 
	contentContainer.innerHTML = ""; 
	
	if (canvasNumber == "Invalid Input Parameters") return; 
	
	// Render the canvas dotted contents
    /* Background */	// Get the smallest radius circle that will fit in all circles
    /* Background */	var radiusSize; 
    /* Background */	var r1 = parseInt((window.innerWidth * 2 / 3) / 16); 
    /* Background */	var r2 = parseInt((window.innerHeight * 2 / 3) / 6); 
    /* Background */	if (r1 < r2) 
    /* Background */		radiusSize = r1; 
    /* Background */	else
    /* Background */		radiusSize = r2; 
    /* Background */	// Render circles row by row
    /* Background */	var offsetX = (window.innerWidth - (2 * radiusSize + 16 * radiusSize * 4 / 3)) / 2;
    /* Background */	var offsetY = (window.innerHeight - (2 * radiusSize + radiusSize * 23 / 3)) / 2;
    /* Background */	// Top Row
    /* Background */	for (var trc = 0; trc < 16; trc++) {
    /* Background */		var centerX = offsetX + radiusSize + trc * radiusSize * 4 / 3; 
    /* Background */		var centerY = offsetY + radiusSize;  
    /* Background */		drawCircle(centerX, centerY, radiusSize, 72 + trc); 
    /* Background */	}
    /* Background */	// Second Row
    /* Background */	for (var trc = 0; trc < 14; trc++) {
    /* Background */		var centerX = offsetX + 3.8 / 3 * radiusSize + radiusSize + trc * radiusSize * 4 / 3; 
    /* Background */		var centerY = offsetY + radiusSize * 7 / 3 ; 
    /* Background */		drawCircle(centerX, centerY, radiusSize, 58 + trc); 
    /* Background */	}
    /* Background */	// Third Row
    /* Background */	for (var trc = 0; trc < 15; trc++) {
    /* Background */		var centerX = offsetX + radiusSize * 1.6 + trc * radiusSize * 4 / 3; 
    /* Background */		var centerY = offsetY + radiusSize * 11 / 3; 
    /* Background */		drawCircle(centerX, centerY, radiusSize, 43 + trc); 
    /* Background */	}
    /* Background */	// Fourth Row
    /* Background */	for (var trc = 0; trc < 14; trc++) {
    /* Background */		var centerX = offsetX + 3.8 / 3 * radiusSize + radiusSize + trc * radiusSize * 4 / 3; 
    /* Background */		var centerY = offsetY + radiusSize * 15 / 3 ; 
    /* Background */		drawCircle(centerX, centerY, radiusSize, 29 + trc); 
    /* Background */	}
    /* Background */	// Fifth Row
    /* Background */	for (var trc = 0; trc < 15; trc++) {
    /* Background */		var centerX = offsetX + radiusSize * 1.6 + trc * radiusSize * 4 / 3;
    /* Background */		var centerY = offsetY + radiusSize * 19 / 3; 
    /* Background */		drawCircle(centerX, centerY, radiusSize, 14 + trc); 
    /* Background */	}
    /* Background */	// Sixth Row
    /* Background */	for (var trc = 0; trc < 13; trc++) {
    /* Background */		var centerX = offsetX + radiusSize * 2.9 + trc * radiusSize * 4 / 3; 
    /* Background */		var centerY = offsetY + radiusSize * 23 / 3; 
    /* Background */		drawCircle(centerX, centerY, radiusSize, 1 + trc); 
    /* Background */	}
	
	// TODO: handle rendering of permanent dots. 
}

function drawCircle(centerX, centerY, radius, n) {
	var contentContainer = document.getElementById('contentContainer'); 
	// <div class="circle5" id="circle1" style="position:absolute; left: 10px; top:10px; width:32px; height:32px; ">
	// <center> 1 </center>
	// </div>
	var res = "<div class='circle" + canvasNumber + "' style='position:absolute; left:" + (centerX - 1/3 * radius) + "px; top:" + (centerY - 1/3 * radius) + "px; width: " + radius * 2 + "px; height:" + radius * 2 + "px; font-size: " + (radius * 2/3) + "px' onclick='handleClick(" + n + ")' onmouseenter='handleHover(" + n + ")'><center>" + n + "</center></div>"; 
	contentContainer.innerHTML += res; 
}

function handleClick(n) {
	// TODO: handle adding or removing permanent dots.
	// TODO: handle the playing of all notes on click. 
	console.log("Clicked " + n); 
}

function handleHover(n) {
	// TODO: handle playing of note when hover over. 
	console.log("Hovered " + n); 
}

// TODO: add a slow firing timer to update content based on selected frame. 

redraw(); 