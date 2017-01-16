// FOR BOOLEAN VALUES, USE loadBooleanPreverence(Key)

/* Implemented */ const SETTINGS_USERNAME = "bitty.synth.setting.usrName";
/* Implemented */ const SETTINGS_PROMPT_NEW = "bitty.synth.setting.pmptNew";
/* Unused */ const SETTINGS_PROMPT_EXIT = "bitty.synth.setting.pmptExit";
/* Implemented */ const SETTINGS_GRAPHICS_QUALITY = "bitty.synth.setting.graphicsQ";
/* Implemented */ const SETTINGS_SHOW_FPS = "bitty.synth.setting.showFPS";
/* Implemented */ const SETTINGS_USE_FPS = "bitty.synth.setting.useFPS";
/* Unused */ const SETTINGS_LIVEVIEW_SHOW_CANVAS_KEYS = "bitty.synth.setting.liveviewShowCanvasKeys";
/* Implemented */ const SETTINGS_LIVEVIEW_SHOW_MINI_KEYBOARD = "bitty.synth.setting.liveviewShowMiniKeyboard";
/* Unused */ const SETTINGS_LIVEVIEW_SHOW_FX_PANEL = "bitty.synth.setting.liveviewShowFXPanel";
/* Implemented */ const SETTINGS_SHOW_SHADOW_PREVIOUS = "bitty.synth.setting.showShadowPrevious";
/* Implemented */ const SETTINGS_SHOW_SHADOW_PREDICTION = "bitty.synth.setting.showShadowPrediction";
/* Unused */ const SETTINGS_ALLOW_DOWNLOAD_PREDICTIONS = "bitty.synth.setting.allowDldPredictions";
/* Implemented */ const SETTINGS_PLAYBACK_USE_MULTITHREAD = "bitty.synth.setting.useMultiThreadPlayback";
/* Implemented */ const SETTINGS_PREDICITON_SEQUENCE_LENGTH = "bitty.synth.setting.predictionSequenceLength";
/* Implemented */ const SETTINGS_PREDICTION_MODE = "bitty.synth.setting.predictionMode";
/* Implemented */ const SETTINGS_PREDICTION_COUNT = "bitty.synth.setting.predictionCount";
/* Implemented */ const SETTINGS_PREDICTION_LIBRARY = "bitty.synth.setting.predictionLibrary";
/* Implemented */ const SETTINGS_LIVEVIEW_INSTRUMENT = "bitty.synth.setting.liveviewInstrument";

var isMobile = false;

if (window.navigator.userAgent.indexOf("Android") != -1 || window.navigator.userAgent.indexOf("iPhone") != -1 || window.navigator.userAgent.indexOf("iPad") != -1) {
	console.log("Preferences.js - Mobile Platform Detected");
	isMobile = true;
} else {
	console.log("Preferences.js - Desktop Platform Detected");
	isMobile = false;
}

function saveForm() {
	// checked: true || false.
	localStorage.setItem(SETTINGS_USERNAME, document.getElementById("txtName").value);
	localStorage.setItem(SETTINGS_PROMPT_NEW, document.getElementById("chkPromptNew").checked);
	// graphicsQ: 1 - 100%; 2 - 50%; 3 - 25%.
	localStorage.setItem(SETTINGS_GRAPHICS_QUALITY, document.getElementById("cboGraphicsQuality").selectedIndex);
	localStorage.setItem(SETTINGS_SHOW_FPS, document.getElementById("chkShowFPS").checked);
	localStorage.setItem(SETTINGS_USE_FPS, document.getElementById("chkUseFPS").checked);
	localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_MINI_KEYBOARD, document.getElementById("chkShowMiniKeyboard").checked);
	localStorage.setItem(SETTINGS_SHOW_SHADOW_PREVIOUS, document.getElementById("chkShowShadowPrevious").checked);
	localStorage.setItem(SETTINGS_SHOW_SHADOW_PREDICTION, document.getElementById("chkShowShadowPrediction").checked);
	localStorage.setItem(SETTINGS_LIVEVIEW_INSTRUMENT, document.getElementById("instrument").value);
	localStorage.setItem(SETTINGS_PLAYBACK_USE_MULTITHREAD, document.getElementById("chkMultithreadPlayback").checked);
	localStorage.setItem(SETTINGS_PREDICITON_SEQUENCE_LENGTH, document.getElementById("txtPredictionSequenceLength").value);
	localStorage.setItem(SETTINGS_PREDICTION_MODE, document.getElementById("predictionmode").value);
	localStorage.setItem(SETTINGS_PREDICTION_COUNT, document.getElementById("txtPredictionCount").value);
	localStorage.setItem(SETTINGS_PREDICTION_LIBRARY, document.getElementById("predictionlibrary").value);
}

function loadForm() {
	if (document.getElementById("txtName")==null || document.getElementById("txtName")=="null") return;
	document.getElementById("txtName").value = localStorage.getItem(SETTINGS_USERNAME);
	document.getElementById("chkPromptNew").checked = "true" == localStorage.getItem(SETTINGS_PROMPT_NEW);
	document.getElementById("cboGraphicsQuality").selectedIndex = parseInt(localStorage.getItem(SETTINGS_GRAPHICS_QUALITY));
	document.getElementById("chkShowFPS").checked = "true" == localStorage.getItem(SETTINGS_SHOW_FPS);
	document.getElementById("chkUseFPS").checked = "true" == localStorage.getItem(SETTINGS_USE_FPS);
	document.getElementById("chkShowMiniKeyboard").checked = "true" == localStorage.getItem(SETTINGS_LIVEVIEW_SHOW_MINI_KEYBOARD);
	document.getElementById("chkShowShadowPrevious").checked = "true" == localStorage.getItem(SETTINGS_SHOW_SHADOW_PREVIOUS);
	document.getElementById("chkShowShadowPrediction").checked = "true" == localStorage.getItem(SETTINGS_SHOW_SHADOW_PREDICTION);
	document.getElementById("instrument").value = localStorage.getItem(SETTINGS_LIVEVIEW_INSTRUMENT);
	document.getElementById("chkMultithreadPlayback").checked = "true" == localStorage.getItem(SETTINGS_PLAYBACK_USE_MULTITHREAD);
	document.getElementById("txtPredictionSequenceLength").value = localStorage.getItem(SETTINGS_PREDICITON_SEQUENCE_LENGTH);
	document.getElementById("predictionmode").value = localStorage.getItem(SETTINGS_PREDICTION_MODE);
	document.getElementById("txtPredictionCount").value = localStorage.getItem(SETTINGS_PREDICTION_COUNT);
	document.getElementById("predictionlibrary").value = localStorage.getItem(SETTINGS_PREDICTION_LIBRARY);
	// Refresh the combobox.
	$('select').material_select();
}

// Key: one of the constants defined in the header of this JS file.
function loadPreference(key) {
	return localStorage.getItem(key);
}

function loadBooleanPreference(key) {
	return "true" == loadPreference(key);
}

function saveDefaultSettings() {
	// checked: true || false.
	localStorage.setItem(SETTINGS_USERNAME, "");
	localStorage.setItem(SETTINGS_PROMPT_NEW, true);
	localStorage.setItem(SETTINGS_PROMPT_EXIT, false);
	// graphicsQ: 0 - 100%; 1 - 50%; 2 - 25%.
	localStorage.setItem(SETTINGS_GRAPHICS_QUALITY, 0);
	if (isMobile) localStorage.setItem(SETTINGS_GRAPHICS_QUALITY, 1);

	localStorage.setItem(SETTINGS_SHOW_FPS, false);
	localStorage.setItem(SETTINGS_USE_FPS, true);
	localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_CANVAS_KEYS, true);
	localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_MINI_KEYBOARD, true);
	if (isMobile) localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_MINI_KEYBOARD, false);

	localStorage.setItem(SETTINGS_SHOW_SHADOW_PREVIOUS, true);
	localStorage.setItem(SETTINGS_SHOW_SHADOW_PREDICTION, true);
	localStorage.setItem(SETTINGS_LIVEVIEW_INSTRUMENT, "acoustic_grand_piano");
	localStorage.setItem(SETTINGS_PLAYBACK_USE_MULTITHREAD, true);
	if (!isMobile) localStorage.setItem(SETTINGS_PLAYBACK_USE_MULTITHREAD, false);

	localStorage.setItem(SETTINGS_PREDICITON_SEQUENCE_LENGTH, 4);
	if (isMobile) localStorage.setItem(SETTINGS_PREDICITON_SEQUENCE_LENGTH, 0);

	localStorage.setItem(SETTINGS_PREDICTION_MODE, 0);
	localStorage.setItem(SETTINGS_PREDICTION_COUNT, 4);
	localStorage.setItem(SETTINGS_PREDICTION_LIBRARY, 1);
}

// Startup routine for any file: check if settings exist.
if (localStorage.getItem(SETTINGS_USERNAME) == null || localStorage.getItem(SETTINGS_USERNAME) == "null") saveDefaultSettings();

// If the current page is settings, then load settings and set up save settings interval
if (window.location.toString().split("/")[window.location.toString().split("/").length - 1]=="settings.html") {
	loadForm();
	setInterval(saveForm, 500);
}

function getSettingArray() {
	var keyArray = [];
	var valArray = [];
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i).includes("setting")) {
			keyArray.push(localStorage.key(i));
			valArray.push(localStorage.getItem(localStorage.key(i)));
		}
	}
	var retArray = [keyArray, valArray];
	return retArray;
}

function restoreSettingArray(retArray) {
	var keyArray = retArray[0];
	var valArray = retArray[1];
	for (var i = 0; i < keyArray.length; i++) {
		localStorage.setItem(keyArray[i], valArray[i]);
	}
}
