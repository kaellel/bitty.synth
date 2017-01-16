// FOR BOOLEAN VALUES, USE loadBooleanPreverence(Key)

/* Implemented */ const SETTINGS_USERNAME = "bitty.synth.usrName";
/* Implemented */ const SETTINGS_PROMPT_NEW = "bitty.synth.pmptNew"; 
/* Implemented */ const SETTINGS_PROMPT_EXIT = "bitty.synth.pmptExit"; 
/* Implemented */ const SETTINGS_GRAPHICS_QUALITY = "bitty.synth.graphicsQ"; 
/* Implemented */ const SETTINGS_SHOW_FPS = "bitty.synth.showFPS"; 
/* Implemented */ const SETTINGS_USE_FPS = "bitty.synth.useFPS"; 
/* Implemented */ const SETTINGS_LIVEVIEW_SHOW_CANVAS_KEYS = "bitty.synth.liveviewShowCanvasKeys"; 
/* Implemented */ const SETTINGS_LIVEVIEW_SHOW_MINI_KEYBOARD = "bitty.synth.liveviewShowMiniKeyboard";
/* Implemented */ const SETTINGS_LIVEVIEW_SHOW_FX_PANEL = "bitty.synth.liveviewShowFXPanel"; 
/* Implemented */ const SETTINGS_SHOW_SHADOW_PREVIOUS = "bitty.synth.showShadowPrevious"; 
const SETTINGS_SHOW_SHADOW_PREDICTION = "bitty.synth.showShadowPrediction"; 
const SETTINGS_ALLOW_DOWNLOAD_PREDICTIONS = "bitty.synth.allowDldPredictions"; 
/* Implemented */ const SETTINGS_LIVEVIEW_INSTRUMENT = "bitty.synth.liveviewInstrument"; 

function saveForm() {
	// checked: true || false. 
	localStorage.setItem(SETTINGS_USERNAME, document.getElementById("txtName").value); 
	localStorage.setItem(SETTINGS_PROMPT_NEW, document.getElementById("chkPromptNew").checked); 
	localStorage.setItem(SETTINGS_PROMPT_EXIT, document.getElementById("chkPromptExit").checked); 
	// graphicsQ: 1 - 100%; 2 - 50%; 3 - 25%. 
	localStorage.setItem(SETTINGS_GRAPHICS_QUALITY, document.getElementById("cboGraphicsQuality").selectedIndex); 
	localStorage.setItem(SETTINGS_SHOW_FPS, document.getElementById("chkShowFPS").checked); 
	localStorage.setItem(SETTINGS_USE_FPS, document.getElementById("chkUseFPS").checked); 
	localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_CANVAS_KEYS, document.getElementById("chkShowCanvasKeys").checked);
	localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_MINI_KEYBOARD, document.getElementById("chkShowMiniKeyboard").checked);
	localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_FX_PANEL, document.getElementById("chkShowFXPanel").checked); 
	localStorage.setItem(SETTINGS_SHOW_SHADOW_PREVIOUS, document.getElementById("chkShowShadowPrevious").checked); 
	localStorage.setItem(SETTINGS_SHOW_SHADOW_PREDICTION, document.getElementById("chkShowShadowPrediction").checked);
	localStorage.setItem(SETTINGS_ALLOW_DOWNLOAD_PREDICTIONS, document.getElementById("chkAllowDownloadPredictions").checked); 
	localStorage.setItem(SETTINGS_LIVEVIEW_INSTRUMENT, document.getElementById("instrument").value); 
}

function loadForm() {
	if (document.getElementById("txtName")==null || document.getElementById("txtName")=="null") return; 
	document.getElementById("txtName").value = localStorage.getItem(SETTINGS_USERNAME); 
	document.getElementById("chkPromptNew").checked = "true" == localStorage.getItem(SETTINGS_PROMPT_NEW); 
	document.getElementById("chkPromptExit").checked = "true" == localStorage.getItem(SETTINGS_PROMPT_EXIT); 
	document.getElementById("cboGraphicsQuality").selectedIndex = parseInt(localStorage.getItem(SETTINGS_GRAPHICS_QUALITY)); 
	document.getElementById("chkShowFPS").checked = "true" == localStorage.getItem(SETTINGS_SHOW_FPS); 
	document.getElementById("chkUseFPS").checked = "true" == localStorage.getItem(SETTINGS_USE_FPS); 
	document.getElementById("chkShowCanvasKeys").checked = "true" == localStorage.getItem(SETTINGS_LIVEVIEW_SHOW_CANVAS_KEYS);
	document.getElementById("chkShowMiniKeyboard").checked = "true" == localStorage.getItem(SETTINGS_LIVEVIEW_SHOW_MINI_KEYBOARD);
	document.getElementById("chkShowFXPanel").checked = "true" == localStorage.getItem(SETTINGS_LIVEVIEW_SHOW_FX_PANEL); 
	document.getElementById("chkShowShadowPrevious").checked = "true" == localStorage.getItem(SETTINGS_SHOW_SHADOW_PREVIOUS);
	document.getElementById("chkShowShadowPrediction").checked = "true" == localStorage.getItem(SETTINGS_SHOW_SHADOW_PREDICTION);
	document.getElementById("chkAllowDownloadPredictions").checked = "true" == localStorage.getItem(SETTINGS_ALLOW_DOWNLOAD_PREDICTIONS); 
	document.getElementById("instrument").value = localStorage.getItem(SETTINGS_LIVEVIEW_INSTRUMENT); 
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
	localStorage.setItem(SETTINGS_SHOW_FPS, false); 
	localStorage.setItem(SETTINGS_USE_FPS, true); 
	localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_CANVAS_KEYS, true);
	localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_MINI_KEYBOARD, true);
	localStorage.setItem(SETTINGS_LIVEVIEW_SHOW_FX_PANEL, false); 
	localStorage.setItem(SETTINGS_SHOW_SHADOW_PREVIOUS, true); 
	localStorage.setItem(SETTINGS_SHOW_SHADOW_PREDICTION, true);
	localStorage.setItem(SETTINGS_ALLOW_DOWNLOAD_PREDICTIONS, false); 
	localStorage.setItem(SETTINGS_LIVEVIEW_INSTRUMENT, "acoustic_grand_piano"); 
}

// Startup routine for any file: check if settings exist. 
if (localStorage.getItem(SETTINGS_USERNAME) == null || localStorage.getItem(SETTINGS_USERNAME) == "null") saveDefaultSettings(); 

// If the current page is settings, then load settings and set up save settings interval 
if (window.location.toString().split("/")[window.location.toString().split("/").length - 1]=="settings.html") {
	loadForm(); 
	setInterval(saveForm, 500); 
}