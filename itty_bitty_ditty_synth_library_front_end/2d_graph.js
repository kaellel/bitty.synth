/**
 * The repaint method paints a 2d graph of the values in arrContents onto the canvas cvsContent.
 */
function repaint(arrContents, cvsContent) {
	var ctx = cvsContent.getContext('2d');
	var drawHH = cvsContent.height;
	var drawWW = cvsContent.width;

	// Clear the canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, drawWW, drawHH);

	// Draw Y axis
	ctx.beginPath();
    ctx.lineWidth = 1;
	ctx.moveTo(5,5);
	ctx.lineTo(5, drawHH - 10);
    ctx.strokeStyle = '#bbdefb';
    ctx.stroke();

	// Draw X axis
	ctx.beginPath();
    ctx.lineWidth = 1;
	ctx.moveTo(5, drawHH - 10);
	ctx.lineTo(drawWW - 10, drawHH - 10);
    ctx.strokeStyle = '#bbdefb';
    ctx.stroke();

	var startIndex = 0;

	// Draw points
	// Determine X-Spacing
	var xSpacing = (drawWW - 15) / (arrContents.length - startIndex);
	// Draw the points
	// First find out the highest point to create a relative scale.

	var highest = arrContents[startIndex];
	for (var i = startIndex + 1; i < arrContents.length; i++)
		if (parseInt(arrContents[i]) > highest) highest = arrContents[i];
	// Modify all points to correspond to the relative scale
	var arrPoints = [];
	for (var i = startIndex; i < arrContents.length; i++) {
		arrPoints.push(parseInt(arrContents[i]) * 1 / highest * (drawHH - 40));
	}
	// Draw the lines
	for (var i = 1; i < arrPoints.length; i++) {
		var centerX = (i + 0.5) * xSpacing + 10;
		var centerY = drawHH - 10 - arrPoints[i];
		var centerX2 = (i - 0.5) * xSpacing + 10;
		var centerY2 = drawHH - 10 - arrPoints[i-1];
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.moveTo(centerX2, centerY2);
		ctx.lineTo(centerX, centerY);
		ctx.strokeStyle = '#64b5f6';
		ctx.stroke();
	}
	// Draw the points
	for (var i = 0; i < arrPoints.length; i++) {
		var centerX = (i + 0.5) * xSpacing + 10;
		var centerY = drawHH - 10 - arrPoints[i];
		ctx.fillStyle = "#4E90BF";
		ctx.beginPath();
		ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI, false);
		ctx.fill();
	}
}

/**
 * The repaint method paints a 2d graph of the values in arrContents onto the canvas cvsContent.
 * arrContents[x] = [y0, y1...yn]
 */
function repaint2(arrContents, cvsContent) {
	var ctx = cvsContent.getContext('2d');
	var drawHH = cvsContent.height;
	var drawWW = cvsContent.width;

	// Clear the canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, drawWW, drawHH);

	// Draw Y axis
	ctx.beginPath();
    ctx.lineWidth = 1;
	ctx.moveTo(5,5);
	ctx.lineTo(5, drawHH - 10);
    ctx.strokeStyle = '#bbdefb';
    ctx.stroke();

	// Draw X axis
	ctx.beginPath();
    ctx.lineWidth = 1;
	ctx.moveTo(5, drawHH - 10);
	ctx.lineTo(drawWW - 10, drawHH - 10);
    ctx.strokeStyle = '#bbdefb';
    ctx.stroke();

	var startIndex = 0;

	// Draw points
	// Determine X-Spacing
	var xSpacing = (drawWW - 15) / (arrContents.length + 3);
	// Draw the points
	// First find out the highest point to create a relative scale.
	var highest;
	if (arrContents[startIndex].indexOf(",") != -1) {
		highest = parseFloat(arrContents[startIndex].split(",")[0]);
	} else {
		highest = parseFloat(arrContents[startIndex]);
	}

	for (var i = startIndex; i < arrContents.length; i++) {
		var curContent;

		if (arrContents[i].indexOf(",") != -1) {
			var curContents = arrContents[startIndex].split(",");
			curContent = parseFloat(Math.max(...curContents));
		} else {
			curContent = parseFloat(arrContents[i]);
		}

		if (curContent > highest) highest = curContent;
	}

	// Modify all points to correspond to the relative scale
	var arrPoints = [];
	for (var i = 0; i < arrContents.length; i++) {
		if (arrContents[i].indexOf(",") != -1) {
			var curContents = arrContents[i].split(",");
			curContents.forEach(function (element){
				arrPoints.push((i) + "," + (parseInt(element) * 1 / highest * (drawHH - 40)));
			});
		} else {
			arrPoints.push((i) + "," + (parseInt(arrContents[i]) * 1 / highest * (drawHH - 40)));
		}
	}

	// Draw the points
	for (var i = 0; i < arrPoints.length; i++) {
		var cdX = parseInt(arrPoints[i].split(",")[0]);
		var cdY = parseInt(arrPoints[i].split(",")[1]);

		var centerX = 10 + (cdX + 3) * xSpacing;
		var centerY = drawHH - 10 - cdY;
		ctx.fillStyle = "#4E90BF";
		ctx.beginPath();
		ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI, false);
		ctx.fill();
	}
}
