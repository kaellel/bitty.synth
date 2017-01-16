var playable = true;
MIDI.loadPlugin({
	instrument:"acoustic_grand_piano",
	onprogress: function(state, progress) {
		// console.log("Loading static component for canvasplayer.js... ");
	},
	onsuccess: function() {
		// console.log("Static component for canvasplayer.js loaded. ");
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
	playable = true;
	MIDI.loadPlugin({
		instrument:instrumentName,
		onprogress: function(state, progress) {
			//console.log("Loading static component for canvasplayer.js... ");
		},
		onsuccess: function() {
			//console.log("Static component for canvasplayer.js loaded. ");
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
	loadInstrumentJS(instrumentName);
	console.log("Static component for canvasplayer.js - JS Loaded");
	setTimeout(function(){loadInstrument(instrumentName)}, 5000);
}

// This function called within the play function of the canvasplayback object.
function programChangeLoadInstrument(instrumentName) {
	if (playable) {
		MIDI.programChange(0, MIDI.GM.byName[instrumentName].number);
	}
}

// Object definition of the canvasplayback object.
function canvasplayback(index){
	// This function returns whether the canvas contains any more frames that have content after the index findex.
	this.containsContent1 = function (findex){
		// Pass one: check if localStorage contains any canvasN.frameN at all
		var lastExistingIndex = 0;

		for (var i = 0; i < 1000; i++) {
			var contents;
			contents = localStorage.getItem("bitty.synth." + index + "." + (i));
			if (contents != "null" && contents != null && contents != "{}" && contents != "{,}")
				lastExistingIndex = (i);
			contents = localStorage.getItem("bitty.synth." + index + "." + (2000 - i));
			if (contents != "null" && contents != null && contents != "{}" && contents != "{,}") {
				lastExistingIndex = 2000 - i;
				break;
			}
		}


		return findex < lastExistingIndex;
	};

	this.containsContent = function (findex) {
		return findex < lastExistingIndexI;
	}

	var firstTimeStamp = Math.floor(Date.now());
	console.log("Begin finding last index, time=" + firstTimeStamp);
	var lastExistingIndexI = 0;
	while (this.containsContent1(lastExistingIndexI)) {
		lastExistingIndexI ++;
	}
	var lastTimeStamp = Math.floor(Date.now());
	console.log("Found last index: " + lastExistingIndexI + " with elapsed " + (lastTimeStamp - firstTimeStamp));

	// Load contents of the canvas into an array.
	var canvasFrames = new Array(lastExistingIndexI ++);

	// This function returns an array of notes for the specified frame
	function loadFrame(canvasN, frameN){
		var a = [];
		var loadString = localStorage.getItem("bitty.synth." + index + "." + frameN);
		if (loadString == null || loadString == "null") return a;
		loadString = loadString.substring(1, loadString.length - 1);
		a = loadString.split(",");
		return(a);
	}

	var tempI = 0;
	var songLength = 0;

	console.log("Begin modifying array. ");
	for (tempI = 0; tempI < lastExistingIndexI; tempI++){
		canvasFrames[tempI] = loadFrame(index, tempI);
		songLength++;
	}
	console.log("Finished modifying array. ");

	this.length = function() {
		return songLength;
	};

	// Load the js of the instrument of the canvas if it is different than acoustic_grand_piano
	var instrumentName = localStorage.getItem("bitty.synth.selectedInstrument" + index);
	if (instrumentName=="null" || instrumentName=="" || instrumentName==null) {
		instrumentName = "acoustic_grand_piano";
		localStorage.setItem("bitty.synth.selectedInstrument" + index, instrumentName);
	}
	if (instrumentName != "acoustic_grand_piano") loadInstrumentAggregate(instrumentName);

	function getBPM(){
		var b = localStorage.getItem("bitty.synth.bpm" + index);
		if (b == null || b == "null") b = 128;
		return b;
	}

	var bpm = getBPM();

	this.lengthSeconds = function(){
		return songLength * 60.0 / bpm;
	}

	// The timer variable
	var tmrPlayback;

	// The play method
	this.play = function () {
		playable = true;
		playFrame(0);
	}

	// The stop method
	this.pause = function () {
		playable = false;
	}

	this.currentTime = 0;

	this.duration = this.lengthSeconds();

	this.src = "";

	// Auxiliary method to play frame
	// Note: perform programChange before every frame play since MIDI object is shared.
	// This function also schedules the next playFrame, if applicable.
	// This function also updates bouncing dots, if the location is liveview_canvaskeyboard.html and if a bouncing dot does not exist.
	function playFrame(i) {
		if (playable) {
			programChangeLoadInstrument(instrumentName);

			var dots = canvasFrames[i];
			dots.forEach(function (item, index, array){
				console.log("Note: " + item);
				if (playable) {
					var delay = 0; // play one note every quarter second
					var note = parseInt(item); // the MIDI note
					var velocity = 127; // how hard the note hits

					// play the note
					if (note>0) {
						MIDI.setVolume(0, 127);
						MIDI.noteOn(0, note, velocity, delay);
						MIDI.noteOff(0, note, delay + 0.75);
					}
				}
			});

			if (i + 1 < canvasFrames.length) {
				setTimeout(function(){playFrame(i + 1); }, 1000 * 60 / bpm);
			}
			// Add bouncing dot, if empty
			if (window.location.toString().split("/")[window.location.toString().split("/").length - 1]=="liveview_canvaskeyboard.html") {
				var canvas = document.getElementById('container');
				var drawHH = canvas.height;
				var drawWW = canvas.width;
			    /* Background */	var radiusSize;
			    /* Background */	var r1 = parseInt((drawWW * 2 / 3) / 3);
			    /* Background */	var r2 = parseInt((drawHH * 2 / 3) / 2);
			    /* Background */	if (r1 < r2)
			    /* Background */		radiusSize = r1;
			    /* Background */	else
			    /* Background */		radiusSize = r2;
				var coordX;
				var coordY;
				var coord = gridCoordinates[index].split(",");
				coordX = coord[0];
				coordY = coord[1];
				if (isBouncingDotEmpty(coordX, coordY)) bDots.push(new BouncingDot(coordX, coordY, radiusSize, getColor(index)));
			}
		}
	}
}
