document.getElementById("loadingCover").style.height = window.innerHeight + "px";

onresize = function () {resize();};

function resize () {
	//document.getElementById("container").style.height = 1400 + "px";
	document.getElementById("container").style.width = window.innerWidth + "px";
}

resize();

function hideLoading() {
	document.getElementById("loadingCover").style.visibility = "hidden";
	document.body.style.overflowY = "scroll";
}

setTimeout(hideLoading, 30000); 
