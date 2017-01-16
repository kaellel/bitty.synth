/**
 * The repaint method paints a 3d graph of the values in arrContents[x][y] = z onto the canvas cvsContent. 
 * The x-axis is the one parallel to the window's horizontal borders. 
 * The y-axis is the one travelling into the page. 
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
	ctx.moveTo(drawWW * 0.3, drawHH * 0.7);
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
	
	// Draw the base grid
	// First, find the widest x-coordinate
	var xLength = arrContents.length; 
	var yLength = arrContents[0].length; 
	for (var i = 1; i < xLength; i++) {
		if (arrContents[i].length > yLength) yLength = arrContents[i].length; 
	}
	// Next, produce a 2d array of all the coordinates of the base points. 
	// The y spacing of each coordinate is equal. 
	var gridCoordinates = new Array(xLength); 
	for (var ii = 0; ii < xLength; ii++) 
		gridCoordinates[ii] = new Array(yLength); 
	var ySpacing = (drawHH - 10 - (drawHH * 0.7)) / (yLength + 1); 
	var currentY = drawHH - 10; 
	for (var y = 0; y < yLength; y++) {
		currentY -= ySpacing; 
		// Use pt-slope form y = m(x - a) + b where (a, b) is a point to get the amount of x-Spacing and currentX. 
		var slopeM = (drawHH * 0.7 - drawHH + 10) / (drawWW * 0.3 - 5); 
		// Since we are looking for x in terms of y, this pt-slope form becomes: 
		// x = a + (y - b) / m
		this.getXX = function(yPoint) {
			return 5 + (yPoint - drawHH + 10) / slopeM; 
		}
		var currentX = this.getXX(currentY); 
		var xSpacing = (drawWW - currentX) / (xLength + 1); 
		for (var j = 0; j < xLength; j++) {
			currentX += xSpacing; 
			gridCoordinates[j][y] = "" + currentX + "," + currentY; 
		}
	}
	// Next, draw the points. 
	// Draw the points
	for (var x = 0; x < xLength; x++) {
		for (var y = 0; y < yLength; y++) {
			var coords = gridCoordinates[x][y].split(","); 
			var coordX = parseInt(coords[0]); 
			var coordY = parseInt(coords[1]); 
			var centerX = coordX; 
			var centerY = coordY; 
			ctx.fillStyle = "#CCCCCC"; 
			ctx.beginPath();
			ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI, false);
			ctx.fill();
		}
	}
	
	
	// Now, go on to draw the data lines and points. 
	var pointCoordinates = new Array(xLength); 
	for (var ii = 0; ii < xLength; ii++) 
		pointCoordinates[ii] = new Array(yLength); 
	// Find the highest value
	var highestVal = arrContents[0][0]; 
	if (arrContents[0][0] == undefined) highestVal = 0; 
	for (var i = 0; i < xLength; i++) {
		for (var j = 0; j < yLength; j++) {
			if (arrContents[i][j]>highestVal) highestVal = arrContents[i][j]; 
		}
	}
	// Set up point coordinates
	for (var i = 0; i < xLength; i++) {
		for (var j = 0; j < yLength; j++) {
			var coords = gridCoordinates[i][j].split(","); 
			var coordX = parseInt(coords[0]); 
			var coordY = parseInt(coords[1]); 
			
			coordY -= (arrContents[i][j] / highestVal) * drawHH * 0.7; 
			
			pointCoordinates[i][j] = coordX + "," + coordY;   
		}
	}
	// Draw lines
	for (var i = 0; i < xLength; i++) {
		for (var j = 0; j < yLength; j++) {
			var coords = gridCoordinates[i][j].split(","); 
			var coordX = parseInt(coords[0]); 
			var coordY = parseInt(coords[1]); 
			var centerX = coordX; 
			var centerY = coordY; 
			
			var coords = pointCoordinates[i][j].split(","); 
			var coordX = parseInt(coords[0]); 
			var coordY = parseInt(coords[1]); 
			
			var centerX2 = coordX; 
			var centerY2 = coordY; 
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.moveTo(centerX2, centerY2);
			ctx.lineTo(centerX, centerY);
			ctx.strokeStyle = '#64b5f6';
			ctx.stroke(); 
		}
	}
	// Draw points
	for (var x = 0; x < xLength; x++) {
		for (var y = 0; y < yLength; y++) {
			if (arrContents[x][y] == 0 ) {
				continue; 
			}
			var coords = pointCoordinates[x][y].split(","); 
			var coordX = parseInt(coords[0]); 
			var coordY = parseInt(coords[1]); 
			var centerX = coordX; 
			var centerY = coordY; 
			ctx.fillStyle = "#4E90BF";  // 666666
			ctx.beginPath();
			ctx.arc(centerX, centerY, 1, 0, 2 * Math.PI, false);
			ctx.fill();
		}
	}
}