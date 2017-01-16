// The following section handles the user interface of the canvascontainer and other related global variables.
// *********************************************************************************************************************************
// *********************************************************************************************************************************
// *********************************************************************************************************************************

// This array is filled in during the repaint() procedure and represents the "x, y" location of each key
var gridCoordinates = new Array(88);

// Initialize the MIDI component
var playable = false;
MIDI.loadPlugin({
	instrument:"acoustic_grand_piano",
	onprogress: function(state, progress) {
		//console.log(state, progress);
	},
	onsuccess: function() {
		document.getElementById("loadingCover").style.visibility = "hidden";
		playable = true;
	}
});

// Auxiliary function
function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

// This method used to load an instrument by name.
function loadInstrument(instrumentName) {
	MIDI.loadPlugin({
		instrument:instrumentName,
		onprogress: function(state, progress) {
			console.log(state, progress);
		},
		onsuccess: function() {
			document.getElementById("loadingCover").style.visibility = "hidden";
			playable = true;
		}
	});
	MIDI.programChange(0, MIDI.GM.byName[instrumentName].number);
}

// Use this method to load an instrument's js before loading an instrument
function loadInstrumentJS(instrumentName) {
	loadjscssfile("soundfont/" + instrumentName + "-mp3.js", "js");
}

// Aggregate function to load an instrument on the fly
function loadInstrumentAggregate(instrumentName) {
	document.getElementById("loadingCover").style.visibility = "visible";
	loadInstrumentJS(instrumentName);
	console.log("JS Loaded");
	setTimeout(function(){loadInstrument(instrumentName)}, 5000);
}

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

// The canvas background color
var color1 = "#000000"; 			// lightest color
var color2 = "#000000"; 			// ligher color
var selectioncolor = "#AAAAAA"; 	// color corresponding to the canvas
var bgColor = "#000000";

// Define the colors
switch (parseInt(canvasNumber)){
    case 1:
        selectioncolor = "#00FFFF";
        color2 = "#C4FFFF";
        color1 = "#EAFFFF";
        break;
    case 2:
        selectioncolor = "#7FFF00";
        color2 = "#CAFF96";
        color1 = "#EEFFDD";
        break;
    case 3:
        selectioncolor = "#DC143C";
        color2 = "#D899A7";
        color1 = "#D6CFD1";
        break;
    case 4:
        selectioncolor = "#FF8C00";
        color2 = "#FFC889";
        color1 = "#FFF4E8";
        break;
    case 5:
        selectioncolor = "#483D8B";
        color2 = "#B4AAFF";
        color1 = "#E8E5FF";
        break;
    case -1:
    	selectioncolor = "#8e24aa";
    	color2 = "#ba68c8";
    	color1 = "#f3e5f5";
    	break;
}
bgColor = color2;

document.getElementById('bottomFrame').src = "bottombar.html?canvasn=" + canvasNumber;

// The following section handles localStorage interaction as well as variables related to localStorage.
//*********************************************************************************************************************************
//*********************************************************************************************************************************
//*********************************************************************************************************************************


// Note: frameNumber is loaded in the repaint() event, and the variable frameNumber is declared in the first region.
var instrumentName;
instrumentName = localStorage.getItem("bitty.synth.selectedInstrument" + canvasNumber);
if (instrumentName=="null" || instrumentName=="" || instrumentName==null) {
	instrumentName = "acoustic_grand_piano";
	localStorage.setItem("bitty.synth.selectedInstrument" + canvasNumber, instrumentName);
}

//Call to get current instrument from localStorage
if (instrumentName != "acoustic_grand_piano") loadInstrumentAggregate(instrumentName);

function saveFile(canvasn, framen, array) {
	var saveString = "{";
	if (array != null || array != "null")
		array.forEach(function (item, index, array) {
			saveString += item + ",";
		});
	if (saveString!="{") saveString = saveString.substring(0, saveString.length - 1);
	saveString += "}";
	localStorage.setItem("bitty.synth." + canvasn + "." + framen, saveString);
}

function loadFile(canvasn, framen) {
	var a = [];
	var loadString = localStorage.getItem("bitty.synth." + canvasn + "." + framen);
	if (loadString == null || loadString == "null") return a;
	loadString = loadString.substring(1, loadString.length - 1);
	a = loadString.split(",");
	return(a);
}

function loadClipboard() {
	var a = [];
	var loadString = localStorage.getItem("bitty.synth.clipboard");
	if (loadString == null || loadString == "null") return a;
	loadString = loadString.substring(1, loadString.length - 1);
	a = loadString.split(",");
	return(a);
}

function playCanvas(canvasn, framen){
	var dots = loadFile(canvasn, framen);
	dots.forEach(function (item, index, array){
		if (playable) {
			var delay = 0; // play one note every quarter second
			var note = parseInt(item); // the MIDI note
			var velocity = 127; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
			MIDI.noteOff(0, note, delay + 0.75);
		}
	});
}

// The following section handles the bouncing dot object as well as the global variable array that stores the bouncing dots
//*********************************************************************************************************************************
//*********************************************************************************************************************************
//*********************************************************************************************************************************

var NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
/*
int octave = (key / 12)-1;
int note = key % 12;
String noteName = NOTE_NAMES[note];
*/

var needsRefresh = false;

var bDots = new Array();

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getDotColor() {
	if (parseInt(canvasNumber)==-1) return getRandomColor();
	return selectioncolor;
}

function BouncingDot(x, y, rSize, c = getDotColor()) {
    // On creation, the BouncingDot will play the note it corresponds to.
    /* Play Note */		// First, find the key corresponding to the coordinates
    /* Play Note */		var key = 0;
    /* Play Note */		gridCoordinates.forEach(function (item, index, array) {
    /* Play Note */			// Get the grid X and grid Y from splitting the string
    /* Play Note */			var coord = item.split(",");
    /* Play Note */			var coordX = coord[0];
    /* Play Note */			var coordY = coord[1];
    /* Play Note */			if (x==coordX && y==coordY) key = index;
    /* Play Note */		});
	/* Play Note */		key += 20;
	/* Play Note */		if (playable) {
	/* Play Note */			var delay = 0; // play one note every quarter second
	/* Play Note */			var note = key; // the MIDI note
	/* Play Note */			var velocity = 127; // how hard the note hits
	/* Play Note */			// play the note
	/* Play Note */			MIDI.setVolume(0, 127);
	/* Play Note */			MIDI.noteOn(0, note, velocity, delay);
	/* Play Note */			MIDI.noteOff(0, note, delay + 0.75);
	/* Play Note */		}

    // Object definition and code
    this.rS = rSize;
    this.x = x;
    this.y = y;
    this.radius = rSize * 0.7;
    this.isExpanding = true;
    this.enabled = true;
    this.color = c; 	//getRandomColor();
    this.update = function (){
        var radiusSize;
        var r1 = parseInt((window.innerWidth * 2 / 3) / 16);
        var r2 = parseInt((window.innerHeight * 2 / 3) / 6);
        if (r1 < r2)
            radiusSize = r1;
        else
            radiusSize = r2;

        if (this.isExpanding)
            this.radius += 0.08 / fractionalScaling * radiusSize / fps * 50;
        else
            this.radius -= 0.08 / fractionalScaling * radiusSize / fps * 50;

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



// The following section handles the repaint method and also declares mouse and touch variables.
//*********************************************************************************************************************************
//*********************************************************************************************************************************
//*********************************************************************************************************************************

var lastCalledTime;
var fps;

// FPS Counter
function requestAnimFrame() {
	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
		return;
	}
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1 / delta;
	if (fps < 5) fps =30;
}

var mouseX = 0;
var mouseY = 0;
var touches; 					// Usage: if (!touches == null) touches[n].clientX, touches[n].clientY
var countTicks = 0; 			// Usage: for reducing the amount of times repaint() calculates mouse/touch point proximity to grid[]
var fractionalScaling = 1; 		// Usage: in repaint(), this is used to scale down the rendering load
if (parseInt(loadPreference(SETTINGS_GRAPHICS_QUALITY)) == 1) fractionalScaling = 1.414;
if (parseInt(loadPreference(SETTINGS_GRAPHICS_QUALITY)) == 2) fractionalScaling = 2;

// The following method(s) repaints the content according to the current canvas number
// and the current selected frame as stored in the localStorage.
// The method also paints bouncing dots at cursor positions or touch positions as indicated.
//
// In sum, the method(s) does the following in the following order:
//		- Render canvas background.
//		- Render existing permanent dots.
// 		- Add bouncing dots at each (x, y) where the mouse or touch presides if a bouncing dot does not exist at that point.
//		- Update all bouncing dots so that they diminish in size. (Done in a call to function refresh. )
//		- If the bouncing dot is a new bouncing dot, then a note is played.
// 		- If the bouncing dot is too small, then the bouncing dot is destroyed, i.e., not rendered and skipped.
//		- Schedule the next repaint method call for a smooth 60 fps.
//
// Remember to check for (!touches == null) to prevent null reference.
//

/* Clear Canvas */	var backgroundI = new Image();
/* Clear Canvas */	backgroundI.src = "images/stripes.png";

function repaint() {
	var hasEnabled = false;
	if (bDots != null) {
		bDots.forEach(function (item, index, array) {
			var dot = item;
			if (dot.enabled) {
				hasEnabled = true;
			}
		});
    }
	needsRefresh = hasEnabled;

    // Set up the canvas variables
    /* Set Up Canvas */	var canvas = document.getElementById('container');
    /* Set Up Canvas */	if (canvas.width != window.innerWidth / fractionalScaling) canvas.width = window.innerWidth / fractionalScaling;
    /* Set Up Canvas */	if (canvas.height != window.innerHeight / fractionalScaling) canvas.height = window.innerHeight / fractionalScaling;
    /* Set Up Canvas */	var ctx = canvas.getContext('2d');
	/* Set Up Canvas */ var drawHH = canvas.height;
	/* Set Up Canvas */ var drawWW = canvas.width;
	/* Set Up Canvas */ if (parseInt(canvasNumber)==-1) {
	/* Set Up Canvas */	var tmpccc = drawHH;
	/* Set Up Canvas */		drawHH = drawWW;
	/* Set Up Canvas */		drawWW = tmpccc;
	/* Set Up Canvas */	}

    // Clear the canvas
    /* Clear Canvas */	ctx.fillStyle = '#FFFFFF';
    /* Clear Canvas */	ctx.fillRect(0, 0, drawWW, drawHH);

	/* Clear Canvas */	for (var bX = 0; bX <= drawWW / 51 + 1; bX++)
	/* Clear Canvas */		for (var bY = 0; bY <= drawHH / 51 + 1; bY++)
	/* Clear Canvas */			ctx.drawImage(backgroundI, bX * 51, bY * 51);

	// Render existing permanent dots according to loaded data
    var permanentPoints = loadFile(canvasNumber, frameNumber);
    var prevPoints = null;
    if (frameNumber > 0) prevPoints = loadFile(canvasNumber, frameNumber - 1);
    var shadowColor = "#DDDDDD";

    // Render the canvas dotted background
    /* Background */	// Get the smallest radius circle that will fit in all circles
    /* Background */	ctx.fillStyle = bgColor;
    /* Background */	var radiusSize;
    /* Background */	var r1 = parseInt((drawWW * 2 / 3) / 16);
    /* Background */	var r2 = parseInt((drawHH * 2 / 3) / 6);
    /* Background */	if (r1 < r2)
    /* Background */		radiusSize = r1;
    /* Background */	else
    /* Background */		radiusSize = r2;
    /* Background */	// Render circles row by row
    /* Background */	var offsetX = (drawWW - (2 * radiusSize + 15 * radiusSize * 4 / 3)) / 2;
    /* Background */	var offsetY = (drawHH - (2 * radiusSize + radiusSize * 22 / 3)) / 2;
    /* Background */	// Top Row
    /* Background */	for (var trc = 0; trc < 16; trc++) {
    /* Background */		ctx.fillStyle = bgColor;
    /* Background */		var centerX = offsetX + radiusSize + trc * radiusSize * 4 / 3;
    /* Background */		var centerY = offsetY + radiusSize;
    /* Background */		if (parseInt(canvasNumber)==-1) {
    /* Background */			var tmpccc = centerX;
    /* Background */			centerX = centerY;
    /* Background */			centerY = tmpccc ;
    /* Background */		}
    /* Background */		ctx.beginPath();
    /* Background */		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */		ctx.fill();
    /* Background */		ctx.lineWidth = 5 / fractionalScaling;
    /* Background */		ctx.strokeStyle = '#FFFFFF';
    /* Background */		ctx.stroke();
    /* Background */		ctx.fillStyle = "#FFFFFF";
    /* Background */		ctx.font = (radiusSize * 0.55) + "px Arial";
	var key = 72 + trc + 21;
	var octave = (parseInt(key / 12))-1;
	var note = key % 12;
	var noteName = NOTE_NAMES[note];
    ctx.fillText(noteName + octave, centerX - 0.7 * radiusSize, centerY - 0.1 * radiusSize);
    /* Background */		gridCoordinates[72 + trc] = centerX + "," + centerY;
    /* Background */		if (frameNumber > 0 && loadBooleanPreference(SETTINGS_SHOW_SHADOW_PREVIOUS) && prevPoints != null) {
    /* Background */			prevPoints.forEach(function (item, index, array){
    /* Background */			    if (item==72+trc+21) {
    /* Background */				   	ctx.fillStyle = shadowColor;
    /* Background */					ctx.beginPath();
    /* Background */					ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */					ctx.fill();
    /* Background */					ctx.lineWidth = 5 / fractionalScaling;
    /* Background */					ctx.strokeStyle = '#FFFFFF';
    /* Background */					ctx.stroke();
    /* Background */				}
    /* Background */			});
    /* Background */    	}
    /* Background */		permanentPoints.forEach(function (item, index, array){
    /* Background */			if (item==72+trc+21) {
   	/* Background */				ctx.fillStyle = selectioncolor;
   	/* Background */				ctx.beginPath();
   	/* Background */		 		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
   	/* Background */				ctx.fill();
   	/* Background */				ctx.lineWidth = 5 / fractionalScaling;
   	/* Background */				ctx.strokeStyle = '#FFFFFF';
   	/* Background */				ctx.stroke();
   	/* Background */			}
    /* Background */		});
    /* Background */	}
    /* Background */	// Second Row
    /* Background */	for (var trc = 0; trc < 14; trc++) {
    /* Background */		ctx.fillStyle = bgColor;
    /* Background */		var centerX = offsetX + 3.8 / 3 * radiusSize + radiusSize + trc * radiusSize * 4 / 3;
    /* Background */		var centerY = offsetY + radiusSize * 7 / 3 ;
    /* Background */		if (parseInt(canvasNumber)==-1) {
    /* Background */			var tmpccc = centerX;
    /* Background */			centerX = centerY;
    /* Background */			centerY = tmpccc ;
    /* Background */		}
    /* Background */		ctx.beginPath();
    /* Background */		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */		ctx.fill();
    /* Background */		ctx.lineWidth = 5 / fractionalScaling;
    /* Background */		ctx.strokeStyle = '#FFFFFF';
    /* Background */		ctx.stroke();
    /* Background */		ctx.fillStyle = "#FFFFFF";
    /* Background */		ctx.font = (radiusSize * 0.55) + "px Arial"
	var key = 58 + trc + 21;
	var octave = (parseInt(key / 12))-1;
	var note = key % 12;
	var noteName = NOTE_NAMES[note];
    ctx.fillText(noteName + octave, centerX - 0.7 * radiusSize, centerY - 0.1 * radiusSize);

    /* Background */		gridCoordinates[58 + trc] = centerX + "," + centerY;
    /* Background */		if (frameNumber > 0 && loadBooleanPreference(SETTINGS_SHOW_SHADOW_PREVIOUS) && prevPoints != null) {
    /* Background */			prevPoints.forEach(function (item, index, array){
    /* Background */			    if (item==58+trc+21) {
    /* Background */				   	ctx.fillStyle = shadowColor;
    /* Background */					ctx.beginPath();
    /* Background */					ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */					ctx.fill();
    /* Background */					ctx.lineWidth = 5 / fractionalScaling;
    /* Background */					ctx.strokeStyle = '#FFFFFF';
    /* Background */					ctx.stroke();
    /* Background */				}
    /* Background */			});
    /* Background */    	}
    /* Background */		permanentPoints.forEach(function (item, index, array){
    /* Background */			if (item==58+trc+21) {
   	/* Background */				ctx.fillStyle = selectioncolor;
   	/* Background */				ctx.beginPath();
   	/* Background */		 		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
   	/* Background */				ctx.fill();
   	/* Background */				ctx.lineWidth = 5 / fractionalScaling;
   	/* Background */				ctx.strokeStyle = '#FFFFFF';
   	/* Background */				ctx.stroke();
   	/* Background */			}
    /* Background */		});
    /* Background */	}
    /* Background */	// Third Row
    /* Background */	for (var trc = 0; trc < 15; trc++) {
    /* Background */		ctx.fillStyle = bgColor;
    /* Background */		var centerX = offsetX + radiusSize * 1.6 + trc * radiusSize * 4 / 3;
    /* Background */		var centerY = offsetY + radiusSize * 11 / 3;
    /* Background */		if (parseInt(canvasNumber)==-1) {
    /* Background */			var tmpccc = centerX;
    /* Background */			centerX = centerY;
    /* Background */			centerY = tmpccc ;
    /* Background */		}
    /* Background */		ctx.beginPath();
    /* Background */		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */		ctx.fill();
    /* Background */		ctx.lineWidth = 5 / fractionalScaling;
    /* Background */		ctx.strokeStyle = '#FFFFFF';
    /* Background */		ctx.stroke();
    /* Background */		ctx.fillStyle = "#FFFFFF";
    /* Background */		ctx.font = (radiusSize * 0.55) + "px Arial"
	var key = 43 + trc + 21;
	var octave = (parseInt(key / 12))-1;
	var note = key % 12;
	var noteName = NOTE_NAMES[note];
    ctx.fillText(noteName + octave, centerX - 0.7 * radiusSize, centerY - 0.1 * radiusSize);

    /* Background */		gridCoordinates[43 + trc] = centerX + "," + centerY;
    /* Background */		if (frameNumber > 0 && loadBooleanPreference(SETTINGS_SHOW_SHADOW_PREVIOUS) && prevPoints != null) {
    /* Background */			prevPoints.forEach(function (item, index, array){
    /* Background */			    if (item==43+trc+21) {
    /* Background */				   	ctx.fillStyle = shadowColor;
    /* Background */					ctx.beginPath();
    /* Background */					ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */					ctx.fill();
    /* Background */					ctx.lineWidth = 5 / fractionalScaling;
    /* Background */					ctx.strokeStyle = '#FFFFFF';
    /* Background */					ctx.stroke();
    /* Background */				}
    /* Background */			});
    /* Background */    	}
    /* Background */		permanentPoints.forEach(function (item, index, array){
    /* Background */			if (item==43+trc+21) {
   	/* Background */				ctx.fillStyle = selectioncolor;
   	/* Background */				ctx.beginPath();
   	/* Background */		 		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
   	/* Background */				ctx.fill();
   	/* Background */				ctx.lineWidth = 5 / fractionalScaling;
   	/* Background */				ctx.strokeStyle = '#FFFFFF';
   	/* Background */				ctx.stroke();
   	/* Background */			}
    /* Background */		});
    /* Background */	}
    /* Background */	// Fourth Row
    /* Background */	for (var trc = 0; trc < 14; trc++) {
    /* Background */		ctx.fillStyle = bgColor;
    /* Background */		var centerX = offsetX + 3.8 / 3 * radiusSize + radiusSize + trc * radiusSize * 4 / 3;
    /* Background */		var centerY = offsetY + radiusSize * 15 / 3 ;
    /* Background */		if (parseInt(canvasNumber)==-1) {
    /* Background */			var tmpccc = centerX;
    /* Background */			centerX = centerY;
    /* Background */			centerY = tmpccc ;
    /* Background */		}
    /* Background */		ctx.beginPath();
    /* Background */		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */		ctx.fill();
    /* Background */		ctx.lineWidth = 5 / fractionalScaling;
    /* Background */		ctx.strokeStyle = '#FFFFFF';
    /* Background */		ctx.stroke();
    /* Background */		ctx.fillStyle = "#FFFFFF";
    /* Background */		ctx.font = (radiusSize * 0.55) + "px Arial"
	var key = 29 + trc + 21;
	var octave = (parseInt(key / 12))-1;
	var note = key % 12;
	var noteName = NOTE_NAMES[note];
    ctx.fillText(noteName + octave, centerX - 0.7 * radiusSize, centerY - 0.1 * radiusSize);

    /* Background */		gridCoordinates[29 + trc] = centerX + "," + centerY;
    /* Background */		if (frameNumber > 0 && loadBooleanPreference(SETTINGS_SHOW_SHADOW_PREVIOUS) && prevPoints != null) {
    /* Background */			prevPoints.forEach(function (item, index, array){
    /* Background */			    if (item==29+trc+21) {
    /* Background */				   	ctx.fillStyle = shadowColor;
    /* Background */					ctx.beginPath();
    /* Background */					ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */					ctx.fill();
    /* Background */					ctx.lineWidth = 5 / fractionalScaling;
    /* Background */					ctx.strokeStyle = '#FFFFFF';
    /* Background */					ctx.stroke();
    /* Background */				}
    /* Background */			});
    /* Background */    	}
    /* Background */		permanentPoints.forEach(function (item, index, array){
    /* Background */			if (item==29+trc+21) {
   	/* Background */				ctx.fillStyle = selectioncolor;
   	/* Background */				ctx.beginPath();
   	/* Background */		 		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
   	/* Background */				ctx.fill();
   	/* Background */				ctx.lineWidth = 5 / fractionalScaling;
   	/* Background */				ctx.strokeStyle = '#FFFFFF';
   	/* Background */				ctx.stroke();
   	/* Background */			}
    /* Background */		});
    /* Background */	}
    /* Background */	// Fifth Row
    /* Background */	for (var trc = 0; trc < 15; trc++) {
    /* Background */		ctx.fillStyle = bgColor;
    /* Background */		var centerX = offsetX + radiusSize * 1.6 + trc * radiusSize * 4 / 3;
    /* Background */		var centerY = offsetY + radiusSize * 19 / 3;
    /* Background */		if (parseInt(canvasNumber)==-1) {
    /* Background */			var tmpccc = centerX;
    /* Background */			centerX = centerY;
    /* Background */			centerY = tmpccc ;
    /* Background */		}
    /* Background */		ctx.beginPath();
    /* Background */		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */		ctx.fill();
    /* Background */		ctx.lineWidth = 5 / fractionalScaling;
    /* Background */		ctx.strokeStyle = '#FFFFFF';
    /* Background */		ctx.stroke();
    /* Background */		ctx.fillStyle = "#FFFFFF";
    /* Background */		ctx.font = (radiusSize * 0.55) + "px Arial"
	var key = 14 + trc + 21;
	var octave = (parseInt(key / 12))-1;
	var note = key % 12;
	var noteName = NOTE_NAMES[note];
    ctx.fillText(noteName + octave, centerX - 0.7 * radiusSize, centerY - 0.1 * radiusSize);

    /* Background */		gridCoordinates[14 + trc] = centerX + "," + centerY;
    /* Background */		if (frameNumber > 0 && loadBooleanPreference(SETTINGS_SHOW_SHADOW_PREVIOUS) && prevPoints != null) {
    /* Background */			prevPoints.forEach(function (item, index, array){
    /* Background */			    if (item==14+trc+21) {
    /* Background */				   	ctx.fillStyle = shadowColor;
    /* Background */					ctx.beginPath();
    /* Background */					ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */					ctx.fill();
    /* Background */					ctx.lineWidth = 5 / fractionalScaling;
    /* Background */					ctx.strokeStyle = '#FFFFFF';
    /* Background */					ctx.stroke();
    /* Background */				}
    /* Background */			});
    /* Background */    	}
    /* Background */		permanentPoints.forEach(function (item, index, array){
    /* Background */			if (item==14+trc+21) {
   	/* Background */				ctx.fillStyle = selectioncolor;
   	/* Background */				ctx.beginPath();
   	/* Background */		 		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
   	/* Background */				ctx.fill();
   	/* Background */				ctx.lineWidth = 5 / fractionalScaling;
   	/* Background */				ctx.strokeStyle = '#FFFFFF';
   	/* Background */				ctx.stroke();
   	/* Background */			}
    /* Background */		});
    /* Background */	}
    /* Background */	// Sixth Row
    /* Background */	for (var trc = 0; trc < 13; trc++) {
    /* Background */		ctx.fillStyle = bgColor;
    /* Background */		var centerX = offsetX + radiusSize * 2.9 + trc * radiusSize * 4 / 3;
    /* Background */		var centerY = offsetY + radiusSize * 23 / 3;
    /* Background */		if (parseInt(canvasNumber)==-1) {
    /* Background */			var tmpccc = centerX;
    /* Background */			centerX = centerY;
    /* Background */			centerY = tmpccc ;
    /* Background */		}
    /* Background */		ctx.beginPath();
    /* Background */		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
    /* Background */		ctx.fill();
    /* Background */		ctx.lineWidth = 5 / fractionalScaling;
    /* Background */		ctx.strokeStyle = '#FFFFFF';
    /* Background */		ctx.stroke();
    /* Background */		ctx.fillStyle = "#FFFFFF";
    /* Background */		ctx.font = (radiusSize * 0.55) + "px Arial"
	var key = 1 + trc + 21;
	var octave = (parseInt(key / 12))-1;
	var note = key % 12;
	var noteName = NOTE_NAMES[note];
    ctx.fillText(noteName + octave, centerX - 0.7 * radiusSize, centerY - 0.1 * radiusSize);

    /* Background */		gridCoordinates[1 + trc] = centerX + "," + centerY;
    /* Background */		if (frameNumber > 0 && loadBooleanPreference(SETTINGS_SHOW_SHADOW_PREVIOUS) && prevPoints != null) {
	/* Background */			prevPoints.forEach(function (item, index, array){
	/* Background */			    if (item==1+trc+21) {
	/* Background */				   	ctx.fillStyle = shadowColor;
	/* Background */					ctx.beginPath();
	/* Background */					ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
	/* Background */					ctx.fill();
	/* Background */					ctx.lineWidth = 5 / fractionalScaling;
	/* Background */					ctx.strokeStyle = '#FFFFFF';
	/* Background */					ctx.stroke();
	/* Background */				}
	/* Background */			});
	/* Background */    	}
    /* Background */		permanentPoints.forEach(function (item, index, array){
    /* Background */			if (item==1+trc+21) {
   	/* Background */				ctx.fillStyle = selectioncolor;
   	/* Background */				ctx.beginPath();
   	/* Background */		 		ctx.arc(centerX, centerY, radiusSize, 0, 2 * Math.PI, false);
   	/* Background */				ctx.fill();
   	/* Background */				ctx.lineWidth = 5 / fractionalScaling;
   	/* Background */				ctx.strokeStyle = '#FFFFFF';
   	/* Background */				ctx.stroke();
   	/* Background */			}
    /* Background */		});
    /* Background */	}

    // Render each bouncing dot
    /* Render bDot */	if (bDots != null) {
    /* Render bDot */		bDots.forEach(function (item, index, array) {
    /* Render bDot */			var dot = item;
    /* Render bDot */			if (dot.enabled && dot.radius>0) {
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

	// Render the FPS counter
	/* FPS */	ctx.fillStyle = "#000000";
	/* FPS */	if (loadBooleanPreference(SETTINGS_USE_FPS)) requestAnimFrame();
	/* FPS */ 	ctx.font = (radiusSize) + "px Arial";
	/* FPS */	if (loadBooleanPreference(SETTINGS_SHOW_FPS)) ctx.fillText("FPS: " + fps, 40, 40);

    // Schedule the next repaint method for smooth fps
    /* Schedule Next */	//setTimeout(function (){repaint(); }, 1000 / 100);
	refresh(false, null);
	if (needsRefresh) window.requestAnimationFrame(repaint);
}

// This function is used to refresh touch points, mouse points, instruments, and other local
// storage elements as a separate aspect to smoothen FPS. Dividing the task into two timers
// may help with latency.
// Usage: interval (boolean) sets if the refresh function should schedule another refresh function.
//		  Set interval = false if simply calling the function to handle touch points in touch events.
//		  ttouches (array) overrides the global variable touches and is used only in handling touch
//		  events. TTouches should be set to null if interval = true.
function refresh(interval, ttouches) {
	// The Refresh method does not deal with permanent dots;
	// Permanent dots are added and removed, and played in touch/mouse events.
	// Permanent dots are rendered in the repaint method.

	// Load the current selected frame
    /* Load Selected Frame */	frameNumber = localStorage.getItem("bitty.synth.selectedFrameIndex");

    // Load the current selected canvas's current selected frame's contents from localStorage, if it exists
    frameNumber = localStorage.getItem("bitty.synth.selectedFrameIndex");

    // Load the current selected canvas's current instrument
    if (parseInt(canvasNumber)==-1) {
    	if (!((loadPreference(SETTINGS_LIVEVIEW_INSTRUMENT)) == instrumentName)) {
	    	instrumentName = loadPreference(SETTINGS_LIVEVIEW_INSTRUMENT);
	    	loadInstrumentAggregate(loadPreference(SETTINGS_LIVEVIEW_INSTRUMENT));
	    }
    } else {
	    if (!(localStorage.getItem("bitty.synth.selectedInstrument" + canvasNumber) == instrumentName)) {
	    	instrumentName = localStorage.getItem("bitty.synth.selectedInstrument" + canvasNumber);
	    	loadInstrumentAggregate(localStorage.getItem("bitty.synth.selectedInstrument" + canvasNumber));
	    }
    }

    if (ttouches!=null) touches = ttouches;

    // Some minor background calculations
    /* Set Up Canvas */	var canvas = document.getElementById('container');
	/* Set Up Canvas */ var drawHH = canvas.height;
	/* Set Up Canvas */ var drawWW = canvas.width;
	if (parseInt(canvasNumber)==-1) {
    	var tmpccc = drawHH;
    	drawHH = drawWW;
    	drawWW = tmpccc;
    }


    /* Background */	// Get the smallest radius circle that will fit in all circles
    /* Background */	var radiusSize;
    /* Background */	var r1 = parseInt((drawWW * 2 / 3) / 16);
    /* Background */	var r2 = parseInt((drawHH * 2 / 3) / 6);
    /* Background */	if (r1 < r2)
    /* Background */		radiusSize = r1;
    /* Background */	else
    /* Background */		radiusSize = r2;

    // Playing notes for new bouncing dots is handled in the initializer of the bouncing dot.
    // Adding new bouncing dots is handled in code blocks below.

    // Update the bouncing dot size, including destroying dots too small
    /* Update bDot */	if (bDots != null) {
    /* Update bDot */		bDots.forEach(function (item, index, array) {
    /* Update bDot */			var dot = item;
    /* Update bDot */			if (dot.enabled) {
    /* Update bDot */				dot.update(); 		// TODO : Implement garbage collector
    /* Update bDot */			}
    /* Update bDot */		});
    /* Update bDot */	}

    // Add new dots at empty positions accodording to mouse and touch positions
	// These dots, as described above, are bDots, not permanent dots.
    /* Add Dots */	// In the previous render background step, an array of grid locations will be recorded.
    /* Add Dots */	// If a touch point or a mouse move location is within a 1/2 * radius of the grid location, then a new dot will be added
    /* Add Dots */	// if there is no bouncing dot already at the position.
    /* Add Dots */	// Grid locations stored in arrage gridCoordinates in format of string x,y.
	/* Add Dots */	countTicks ++;
	/* Add Dots */	// if (countTicks % 1 == 0) 				// Adjust this for low performance devices.
    /* Add Dots */		gridCoordinates.forEach(function (item, index, array) {
    /* Add Dots */			var dD = Math.round(0.75 * radiusSize);
	/* Add Dots */			// Get the grid X and grid Y from splitting the string
    /* Add Dots */			var coord = item.split(",");
    /* Add Dots */			var coordX = coord[0];
    /* Add Dots */			var coordY = coord[1];
    /* Add Dots */			// Touch coordinates
    /* Add Dots */			if (touches != null) {
    /* Add Dots */				for (var TI = 0; TI < touches.length; TI++) {
    /* Add Dots */					var touch = touches[TI];
    /* Add Dots */					dX = Math.round(touch.clientX / fractionalScaling) - Math.round(coordX);
    /* Add Dots */					dY = Math.round(touch.clientY / fractionalScaling) - Math.round(coordY);
    /* Add Dots */					// Distance formula
    /* Add Dots */					if (dD * dD >= (dX * dX + dY * dY)) {
    /* Add Dots */						// Add a bouncing dot if a bouncing dot does not exist at the grid location.
    /* Add Dots */						// Duplicate below code to further below touch point add bouncing dot code upon edit.
    /* Add Dots */						if (isBouncingDotEmpty(coordX, coordY)) bDots.push(new BouncingDot(coordX, coordY, radiusSize));
    /* Add Dots */					}
    /* Add Dots */				}
    /* Add Dots */			} else {
    /* Add Dots *				// Mouse coordinates
    /* Add Dots */				var dX = mouseX / fractionalScaling - Math.round(coordX);
    /* Add Dots */				var dY = mouseY / fractionalScaling - Math.round(coordY);
    /* Add Dots */				// Distance formula
    /* Add Dots */				if (dD * dD >= (dX * dX + dY * dY)) {
    /* Add Dots */					// Add a bouncing dot if a bouncing dot does not exist at the grid location.
    /* Add Dots */					// This code should match the above code.
    /* Add Dots */					if (isBouncingDotEmpty(coordX, coordY)) bDots.push(new BouncingDot(coordX, coordY, radiusSize));
    /* Add Dots */				}
	/* Add Dots */			}
    /* Add Dots */		});

    // Schedule the next refresh method for smooth fps
    /* Schedule Next */	//if (interval) setTimeout(function (){refresh(true, null); }, 1000 / 100);
}



// The following section handles events.
//*********************************************************************************************************************************
//*********************************************************************************************************************************
//*********************************************************************************************************************************

// This method helps update variables mouseX and mouseY for use in repaint();
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Add event listener to the content canvas to update mouseX and mouseY
container.addEventListener('mousemove', function(evt) {
	if (!needsRefresh) repaint();

    evt.preventDefault();
    var mousePos = getMousePos(container, evt);
    mouseX = mousePos.x;
    mouseY = mousePos.y;
}, false);

// Add event listener to the content canvas to update touch
container.addEventListener('touchstart', function(evt){

    evt.preventDefault();
	touches = evt.targetTouches;
	if (!needsRefresh) repaint();
    refresh(true, evt.targetTouches);

}, false);

// Add event listener to the content canvas to update touch
container.addEventListener('touchmove', function(evt){
	if (!needsRefresh) repaint();
    touches = evt.targetTouches;
}, false);

// Add event listener to the content canvas to add permanent dots after touch release
container.addEventListener('touchend', function(evt){
	if (!needsRefresh) repaint();
    evt.preventDefault();
    if (parseInt(canvasNumber)==-1) {touches = evt.targetTouches; return; }
    // FOR Any button that is released :
    // Add permanent dots to localStorage after release IF there is not dot at the location.
	// Remove permanent dots to localStorage after release IF there is a dot at the location.
    var canvas = document.getElementById('container');
    var drawHH = canvas.height;
	var drawWW = canvas.width;
    var radiusSize;
    var r1 = parseInt((drawWW * 2 / 3) / 16);
    var r2 = parseInt((drawHH * 2 / 3) / 6);
    if (r1 < r2)
    	radiusSize = r1;
    else
    	radiusSize = r2;
    if (touches != null) {
        for (var TI = 0; TI < touches.length; TI++) {
        	var touch = touches[TI];
        	gridCoordinates.forEach(function (item, index, array) {
            	var dD = Math.round(0.75 * radiusSize);
            	// Get the grid X and grid Y from splitting the string
            	var coord = item.split(",");
                var coordX = coord[0];
                var coordY = coord[1];
                // Touch coordinates
                var dX = touch.clientX / fractionalScaling - Math.round(coordX);
                var dY = touch.clientY / fractionalScaling - Math.round(coordY);
                // Distance formula
                if (dD * dD >= (dX * dX + dY * dY)) {
                	// Toggle the dot
                	var permanentPoints = loadFile(canvasNumber, frameNumber);
                	if (permanentPoints.includes("" + parseInt(index + 21)))
                		permanentPoints.splice(permanentPoints.indexOf("" + parseInt(index+21)), 1);
                	else
                		permanentPoints.push(parseInt(index + 21));
                	saveFile(canvasNumber, frameNumber, permanentPoints);
                }
            });
        }
        touches = evt.targetTouches;
    }

    // After adding, all permanent dots are played.
    playCanvas(canvasNumber, frameNumber);
}, false);

// Add event listener to the content canvas to add permanent dots after mouse release
container.addEventListener('mouseup', function(evt){
	if (!needsRefresh) repaint();
    evt.preventDefault();
    if (parseInt(canvasNumber)==-1) return;
    // FOR Any button that is released :
    // Add permanent dots to localStorage after release IF there is not dot at the location.
	// Remove permanent dots to localStorage after release IF there is a dot at the location.
    var canvas = document.getElementById('container');
    var drawHH = canvas.height;
	var drawWW = canvas.width;
    var radiusSize;
    var r1 = parseInt((drawWW * 2 / 3) / 16);
    var r2 = parseInt((drawHH * 2 / 3) / 6);
    if (r1 < r2)
    	radiusSize = r1;
    else
    	radiusSize = r2;
    gridCoordinates.forEach(function (item, index, array) {
    	var dD = Math.round(0.75 * radiusSize);
    	// Get the grid X and grid Y from splitting the string
    	var coord = item.split(",");
        var coordX = coord[0];
        var coordY = coord[1];
        // Mouse coordinates
        var dX = mouseX / fractionalScaling - Math.round(coordX);
        var dY = mouseY / fractionalScaling - Math.round(coordY);
        // Distance formula
        if (dD * dD >= (dX * dX + dY * dY)) {
        	// Toggle the dot
        	var permanentPoints = loadFile(canvasNumber, frameNumber);
        	if (permanentPoints.includes("" + parseInt(index + 21)))
        		permanentPoints.splice(permanentPoints.indexOf("" + parseInt(index + 21)), 1);
        	else
        		permanentPoints.push(parseInt(index + 21));
        	saveFile(canvasNumber, frameNumber, permanentPoints);
        }
    });

    // After adding, all permanent dots are played.
    playCanvas(canvasNumber, frameNumber);
}, false);

window.onresize = function () {
	if (!needsRefresh) repaint();
}

// Fire the first frame render
repaint();

// When canvasNumber == -1, the canvas desired is the Live view keyboard. In
// this case, do not display the FAB as it may interfere with localStorage.
if (parseInt(canvasNumber)==-1) {
	document.getElementById("FAB").style.visibility = "hidden";
}
