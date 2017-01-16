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
	//console.log("Static component for canvasplayer.js - JS Loaded");
	setTimeout(function(){loadInstrument(instrumentName)}, 5000);
}

// This function called within the play function of the canvasplayback object.
function programChangeLoadInstrument(instrumentName) {
	if (playable) {
		MIDI.programChange(0, MIDI.GM.byName[instrumentName].number);
	}
}

var num_threads = 4;
var MT = new Multithread(num_threads);

playable = false;

// Object definition of the canvasplayback object.
function canvasplayback(index){
	// *************************************************************************
	// Begin chunk that contains private instance variables.
	// *************************************************************************
	// Instance variables for the class.
	var lastExistingIndexI = 0;
	var bpm;
	var canvasFrames;
	var tmrPlayback;
	var songLength = 0;
	var instrumentName;
	var useMultiThreadedPlayback = loadBooleanPreference(SETTINGS_PLAYBACK_USE_MULTITHREAD);
	var isPlaying = false;
	var vFXarray = [];
	var pFXarray = [];
	var vFXstart = 0;
	var vFXend = 1000;
	var pFXstart = 0;
	var pFXend = 1000;

	// *************************************************************************
	// Begin chunk that loads effects.
	// *************************************************************************

	function loadEffects() {
		if (localStorage.getItem("bitty.synth.vfxStart" + index) != undefined) {
			vFXstart = parseInt(localStorage.getItem("bitty.synth.vfxStart" + index));
		}
		if (localStorage.getItem("bitty.synth.vfxEnd" + index) != undefined) {
			vFXend = parseInt(localStorage.getItem("bitty.synth.vfxEnd" + index));
		}
		if (localStorage.getItem("bitty.synth.vfxEq" + index) != undefined) {
			var vfxEquation = localStorage.getItem("bitty.synth.vfxEq" + index);
			for (var i = vFXstart; i < vFXend; i++) {
                vFXarray[i] = EvaluateExpression(vfxEquation.toUpperCase().replaceAll("X", "" + i));
            }
		}
		if (localStorage.getItem("bitty.synth.pfxStart" + index) != undefined) {
			pfxStart = parseInt(localStorage.getItem("bitty.synth.pfxStart" + index));
		}
		if (localStorage.getItem("bitty.synth.pfxEnd" + index) != undefined) {
			pfxEnd = parseInt(localStorage.getItem("bitty.synth.pfxEnd" + index));
		}
		if (localStorage.getItem("bitty.synth.pfxEq" + index) != undefined) {
			var pfxEquation = localStorage.getItem("bitty.synth.pfxEq" + index);
			for (var i = pFXstart; i < pFXend; i++) {
                pFXarray[i] = EvaluateExpression(pfxEquation.toUpperCase().replaceAll("X", "" + i));
            }
		}
		//console.log(vFXarray);
		//console.log(pFXarray);
	}

	loadEffects();

	// *************************************************************************
	// Begin chunk that constructs the canvasplayback object.
	// *************************************************************************

	// Multithreaded find last index: pass localStorage and index.
	var multiThreadFindLastIndex = MT.process(
		/* This is the function to be executed on a separate thread */
		function (PassedArg, index) {
			var lastExistingIndexI = 0;
			this.containsContent1 = function (findex){
				var lastExistingIndex = 0;
				for (var i = 0; i < 1000; i++) {
					var contents;
					contents = PassedArg["bitty.synth." + index + "." + (i)];
					if (contents != "null" && contents != null && contents != "{}" && contents != "{,}")
						lastExistingIndex = (i);
					contents = PassedArg["bitty.synth." + index + "." + (2000 - i)];
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
			while (this.containsContent1(lastExistingIndexI)) {
				lastExistingIndexI ++;
			}
			return lastExistingIndexI;
		},
		/* This is the function called back when the function returns */
		function (returnValue) {
			//console.log("Multithreaded found song length: " + returnValue);
			lastExistingIndexI = returnValue;
			// Continue loading object in main thread.
			finishLoad();
		}
	);

	multiThreadFindLastIndex(localStorage, index);

	function finishLoad() {

		// Load contents of the canvas into an array.
		canvasFrames = new Array(lastExistingIndexI ++);

		// This function returns an array of notes for the specified frame
		function loadFrame(canvasN, frameN){
			var a = [];
			var loadString = localStorage.getItem("bitty.synth." + index + "." + frameN);
			if (loadString == null || loadString == "null") return a;
			loadString = loadString.substring(1, loadString.length - 1);
			a = loadString.split(",");
			return(a);
		}

		for (var tempI = 0; tempI < lastExistingIndexI; tempI++){
			canvasFrames[tempI] = loadFrame(index, tempI);
			songLength++;
		}

		// Load the js of the instrument of the canvas if it is different than acoustic_grand_piano
		instrumentName = localStorage.getItem("bitty.synth.selectedInstrument" + index);
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

		bpm = getBPM();

		//console.log("Finished load of canvas " + index);

		hideLoading(index);
	}

	// *************************************************************************
	// Begin chunk that contains accessor methods and other methods.
	// *************************************************************************

	this.length = function() {
		return songLength;
	};

	this.lengthSeconds = function(){
		return songLength * 60.0 / bpm;
	}

	this.containsContent = function (findex) {
		return findex < lastExistingIndexI;
	}

	// The play method
	this.play = function () {
		isPlaying = true;
		if (!useMultiThreadedPlayback) {
			playFrame(0);
		}
	}

	// The stop method
	this.pause = function () {
		isPlaying = false;
	}

	this.currentTime = 0;

	this.duration = function () {
		return this.lengthSeconds();
	}

	this.src = "";

	// Auxiliary method to play frame
	// Note: perform programChange before every frame play since MIDI object is shared.
	// This function also schedules the next playFrame, if applicable.
	// This function also updates bouncing dots, if the location is liveview_canvaskeyboard.html and if a bouncing dot does not exist.
	function playFrame(i) {
		if (isPlaying) {
			if (i + 1 < canvasFrames.length) {
				if (!useMultiThreadedPlayback)
					setTimeout(function(){playFrame(i + 1); }, 1000 * 60 / bpm);
			}

			programChangeLoadInstrument(instrumentName);

			var dots = canvasFrames[i];
			dots.forEach(function (item, index, array){
				//console.log("Note: " + item);
				if (isPlaying) {
					var delay = 0; // play one note every quarter second
					var note = parseInt(item); // the MIDI note
					var velocity = 127; // how hard the note hits

					var pShift = 0;

					if (vFXarray[i] != undefined) velocity = parseInt(vFXarray[i]);
					if (pFXarray[i] != undefined) pShift = parseInt(pFXarray[i]);

					//console.log(velocity);

					// play the note
					if (note>0) {
						MIDI.setVolume(0, velocity);
						MIDI.noteOn(0, note + pShift, velocity, delay);
						MIDI.noteOff(0, note + pShift, delay + 0.75);
					}
				}
			});


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

	function playFrameM(i) {
		programChangeLoadInstrument(instrumentName);

		var dots = canvasFrames[i];
		dots.forEach(function (item, index, array){
			//console.log("Note: " + item);
			if (isPlaying) {
				var delay = 0; // play one note every quarter second
				var note = parseInt(item); // the MIDI note
				var velocity = 127; // how hard the note hits

				var pShift = 0;

				if (vFXarray[i] != undefined) velocity = parseInt(vFXarray[i]);
				if (pFXarray[i] != undefined) pShift = parseInt(pFXarray[i]);

				//console.log(velocity);

				// play the note
				if (note>0) {
					MIDI.setVolume(0, velocity);
					MIDI.noteOn(0, note + pShift, velocity, delay);
					MIDI.noteOff(0, note + pShift, delay + 0.75);
				}
			}
		});


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

	// *************************************************************************
	// Begin chunk that contains multithreaded timer.
	// *************************************************************************

	var currentMultithreadPlaybackFrameIndex = 0;
	var timerTick = 0;
	var timerInterval = 10;

	var workerData = new Blob([document.getElementById('timerScript').textContent], {
		type: "text/javascript"
	});

	var worker = new Worker(window.URL.createObjectURL(workerData));
	worker.addEventListener('message', function(event) {
		if (!event.data) return;
		timerTick += timerInterval;
		if (timerTick >= 1000 * 60 / bpm) {
			if (useMultiThreadedPlayback) {
				if (currentMultithreadPlaybackFrameIndex >= canvasFrames.length) isPlaying = false;
				if (isPlaying) {
					playFrameM(currentMultithreadPlaybackFrameIndex);
					currentMultithreadPlaybackFrameIndex ++;
				} else {
					currentMultithreadPlaybackFrameIndex = 0;
				}
			}
			timerTick = 0;
		}

	}, false);
	worker.postMessage("");
}
