document.getElementById("loadingCover1").style.height = window.innerHeight + "px";
document.getElementById("loadingCover2").style.height = window.innerHeight + "px";
document.getElementById("loadingCover3").style.height = window.innerHeight + "px";
document.getElementById("loadingCover4").style.height = window.innerHeight + "px";
document.getElementById("loadingCover5").style.height = window.innerHeight + "px";

onresize = function () {resize();};

function resize () {
	//document.getElementById("container").style.height = 1400 + "px";
	document.getElementById("container").style.width = window.innerWidth + "px";
}

resize();

var hidden = [];

function hideLoading(i) {
	document.getElementById("loadingCover" + i).style.visibility = "hidden";
	hidden.push(i);
	if (hidden.length == 5) document.body.style.overflowY = "scroll";
}
