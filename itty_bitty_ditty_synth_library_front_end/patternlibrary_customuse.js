/*
    NOTE:
    Use this javascript file to write custom applications that use pattern
    libraries. This template can be used to write custom handling calls for
    the multithreaded portions of code.
*/
/*
The patternLibrary variables are arrays holding separate
patternLibraryConstituent arrays in the format:
    patternLibraryClassical = [
        pLibrary1,
        pLibrary2,
        pLibrary3,
        ...
        pLibraryN
    ];
Each constituent pLibraryN holds pattern information:
    pLibraryN = [
        ";NoteNumber,NoteNumber;;...;NoteNumber,NoteNumber;",       <- pString
        ";NoteNumber,NoteNumber;;...;NoteNumber,NoteNumber;",
        ...
        ";NoteNumber,NoteNumber;;...;NoteNumber,NoteNumber;"
    ];
Accessing a specific pattern is done as follows:
    patternString = patternLibraryClassical[i][j] = pString;
*/

// This can be used to test convertPatternStringTo2dGrid and repaint2.
var testPatternString = "31,15;;32,16;;33,15,56;45,13,78;33,44,11;;22,32;;11,31";

// This can be used to test getPredictions and getPredictionsD.
var testPatternLibraryConstituent1 = [
    "17;22;31;54;45;;;;;;;;26;37",
    "25;23;74;25;86;67;48;45;26;27",
    "36;48;54;36;87;28;49;45;26;28,29,30;22",
    "45;;;;;28",
    "45;44,45,46,47;33;45;78;36",
    "36;45",
    "23;25;62;72;45,46,47,48,49,59;33"
];
var testPatternLibraryConstituent2 = [
    "1,2;3,4;5,6;7",
    "2;3,4;5,6;7,8",
    "3;4;5,6;7;8,9"
];
var testPatternLibraryN = [
    testPatternLibraryConstituent1,
    testPatternLibraryConstituent2
];

// This function returns an array arrRes[x] = [y0, y1...yn]
// Use repaint2(arrContents, cvsContent) in 2d_graph.js to graph returned data
// Format of pString described in header.
function convertPatternStringTo2dGrid(pString) {
    return pString.split(";");
}

// Returns an array of length numberNotes of predictive notes.
// inputSequence is an array of beats.
/*
    Approach to getting preditionsP:
    1.  Get an array of length 2 * numberNotes using getPredictionsD.
    2.  Randomly pick out numberNotes elements from the array.
    3.  Return that array.
*/
function getPPredictions(inputSequence, pLibrary, numberNotes) {
    var arrTmp = getPredictionsD(inputSequence, pLibrary, numberNotes * 2);
    function getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len;
        }
        return result;
    }
    if (arrTmp.length < numberNotes) numberNotes = arrTmp.length;
    return getRandom(arrTmp, numberNotes);
}

// Returns an array of length numberNotes of predictive notes.
// inputSequence is an array of beats.
/*
    Approach to getting predictionsD:
    1.  Minimize the inputSequence to its shortest form while still keeping rhythm.
        This is done by continuously halving the sequence's resolution.
        For instance, #a;;;;#b;;c will become:
                     #a;;#b;c
                     Where "" represents an empty frame.
    2.  Sort each frame in the minimized input sequence so notes are in ascending
        order.
    3.  For each sequence in pLibrary:
        a.  Minimize and sort the sequence from pLibrary
        b.  Check if the input sequence is a substring of the sequence from pLibrary
        c.  If it is, then add a note (or a combination of notes) into the return sequence.
            Note that the return array will be an array of String retArr = ["1,2", "1", etc];
            Before adding, check to see if the found element is already inside the array.
            Do not add repeated elements.
        d.  Check if the return array is at length numberNotes. If it is, then return.
    3.  At this point, if the return array is not at length numberNotes, then there
        is no matching sequence anymore. Just return the retArray.
*/
function getPPredictionsD(inputSequence, pLibrary, numberNotes) {
    // Step 1.
    var minimizedSequence = minimizeSString(inputSequence);
    // Step 2.
    minimizedSequence = sortSString(minimizedSequence) + ";";
    // Step 3.
    // Iterate all sequences in all libraries in pLibrary
    var retArray = [];
    for (var i = 0; i < pLibrary.length; i++) {
        for (var j = 0; j < pLibrary[i].length; j++) {
            var libSequence = pLibrary[i][j];
            // Step 3.a
            libSequence = sortSString(minimizeSString(libSequence)) + ";";
            // Step 3.b
            if (libSequence.indexOf(minimizedSequence) != -1) {
                var ind = libSequence.indexOf(minimizedSequence) + minimizedSequence.length;
                var ind2 = libSequence.indexOf(";", ind);
                if (ind2 < ind) continue;
                // foundPatternNextString is the next frame in a pattern that matches the input sequence.
                var foundPatternNextString = libSequence.substring(ind, ind2);
                // Step 3.c
                if (!retArray.includes(foundPatternNextString)) retArray.push(foundPatternNextString);
                // Step 3.b
                if (retArray.length==numberNotes) return retArray;
            }
        }
    }
    // Step 4.
    return retArray;
}

// This function minimizes a SongString.
function minimizeSString(inputString) {
    if (inputString.indexOf(";") == -1) return inputString;
    var items = inputString.split(";");
    var canBeCompressed = true;
    var outArray = [];
    for (var i = 0; i < Math.ceil((items.length) / 2); i++) {
        // See if lowering the resolution will lose data
        var dP1 = items[2 * i];
        var dP2 = items[2 * i + 1];
        var pushItem;
        if (dP1 == undefined && dP2 == undefined) {
            // Push nothing
            pushItem = "";
        }
        if (dP1 != undefined && dP2 == undefined) {
            pushItem = dP1;
        }
        if (dP1 == undefined && dP2 != undefined) {
            pushItem = dP2;
        }
        if (dP1 != undefined && dP2 != undefined) {
            // Now see if either is empty.
            if (dP1 == "" && dP2 != "")
                pushItem = dP2;
            else if (dP1 != "" && dP2 == "")
                pushItem = dP1;
            else if (dP1 == "" && dP2 == "")
                pushItem = "";
            else
                canBeCompressed = false;
        }
        outArray.push(pushItem);
    }
    var outString = "";
    for (var i = 0; i < outArray.length; i++)
        outString += outArray[i] + ";";
    outString = outString.substring(0, outString.length - 1);
    if (!canBeCompressed)
        return inputString;
    else
        return minimizeSString(outString);
}

// This function sorts each frame in a Song String so that notes are in ascending
// order.
function sortSString(input) {
    var frames = input.split(";");
    var retArray = [];
    for (var i = 0; i < frames.length; i++) {
        var frameContents = frames[i];
        if (frames[i].indexOf(",") != -1) {
            frameContents = frames[i].split(",");
            frameContents.sort();
            var newFrameContents = "";
            for (var j = 0; j < frameContents.length; j++)
                newFrameContents += frameContents[j] + ",";
            frameContents = newFrameContents.substring(0, newFrameContents.length - 1);
        }
        retArray.push(frameContents);
    }
    var retString = "";
    for (var k = 0; k < retArray.length; k++)
        retString += retArray[k] + ";";
    retString = retString.substring(0, retString.length - 1);
    return retString;
}

// ***************************************
// BEGIN Multithread Section
// ***************************************

var num_threads = 4;
var MT = new Multithread(num_threads);

// Call this multithreaded implementation same as above.
// Update the below functions upon each edit.
var asyncGetPredictionsD = MT.process(
	/* This is the function to be executed on a separate thread */
    function (inputSequence, pLibrary, numberNotes) {
        // This function minimizes a SongString.
        function minimizeSString(inputString) {
            if (inputString.indexOf(";") == -1) return inputString;
            var items = inputString.split(";");
            var canBeCompressed = true;
            var outArray = [];
            for (var i = 0; i < Math.ceil((items.length) / 2); i++) {
                // See if lowering the resolution will lose data
                var dP1 = items[2 * i];
                var dP2 = items[2 * i + 1];
                var pushItem;
                if (dP1 == undefined && dP2 == undefined) {
                    // Push nothing
                    pushItem = "";
                }
                if (dP1 != undefined && dP2 == undefined) {
                    pushItem = dP1;
                }
                if (dP1 == undefined && dP2 != undefined) {
                    pushItem = dP2;
                }
                if (dP1 != undefined && dP2 != undefined) {
                    // Now see if either is empty.
                    if (dP1 == "" && dP2 != "")
                        pushItem = dP2;
                    else if (dP1 != "" && dP2 == "")
                        pushItem = dP1;
                    else if (dP1 == "" && dP2 == "")
                        pushItem = "";
                    else
                        canBeCompressed = false;
                }
                outArray.push(pushItem);
            }
            var outString = "";
            for (var i = 0; i < outArray.length; i++)
                outString += outArray[i] + ";";
            outString = outString.substring(0, outString.length - 1);
            if (!canBeCompressed)
                return inputString;
            else
                return minimizeSString(outString);
        }

        // This function sorts each frame in a Song String so that notes are in ascending
        // order.
        function sortSString(input) {
            var frames = input.split(";");
            var retArray = [];
            for (var i = 0; i < frames.length; i++) {
                var frameContents = frames[i];
                if (frames[i].indexOf(",") != -1) {
                    frameContents = frames[i].split(",");
                    frameContents.sort();
                    var newFrameContents = "";
                    for (var j = 0; j < frameContents.length; j++)
                        newFrameContents += frameContents[j] + ",";
                    frameContents = newFrameContents.substring(0, newFrameContents.length - 1);
                }
                retArray.push(frameContents);
            }
            var retString = "";
            for (var k = 0; k < retArray.length; k++)
                retString += retArray[k] + ";";
            retString = retString.substring(0, retString.length - 1);
            return retString;
        }

        // Step 1.
        var minimizedSequence = minimizeSString(inputSequence);
        // Step 2.
        minimizedSequence = sortSString(minimizedSequence) + ";";
        // Step 3.
        // Iterate all sequences in all libraries in pLibrary
        var retArray = [];
        for (var i = 0; i < pLibrary.length; i++) {
            for (var j = 0; j < pLibrary[i].length; j++) {
                var libSequence = pLibrary[i][j];
                // Step 3.a
                libSequence = sortSString(minimizeSString(libSequence)) + ";";
                // Step 3.b
                if (libSequence.indexOf(minimizedSequence) != -1) {
                    var ind = libSequence.indexOf(minimizedSequence) + minimizedSequence.length;
                    var ind2 = libSequence.indexOf(";", ind);
                    if (ind2 < ind) continue;
                    // foundPatternNextString is the next frame in a pattern that matches the input sequence.
                    var foundPatternNextString = libSequence.substring(ind, ind2);
                    // Step 3.c
                    if (!retArray.includes(foundPatternNextString)) retArray.push(foundPatternNextString);
                    // Step 3.b
                    if (retArray.length==numberNotes) return retArray;
                }
            }
        }
        // Step 4.
        return retArray;
    },
	/* This is the function called back when the function returns */
	function (returnValue) {
        gotPatternPredictions(returnValue);
	}
);

// Call this multithreaded implementation same as above.
// Update the below functions upon each edit.
var asyncGetPredictions = MT.process(
	/* This is the function to be executed on a separate thread */
    function getPredictions(inputSequence, pLibrary, numberNotes) {
        function getPredictionsD(inputSequence, pLibrary, numberNotes) {
            // Step 1.
            var minimizedSequence = minimizeSString(inputSequence);
            // Step 2.
            minimizedSequence = sortSString(minimizedSequence) + ";";
            // Step 3.
            // Iterate all sequences in all libraries in pLibrary
            var retArray = [];
            for (var i = 0; i < pLibrary.length; i++) {
                for (var j = 0; j < pLibrary[i].length; j++) {
                    var libSequence = pLibrary[i][j];
                    // Step 3.a
                    libSequence = sortSString(minimizeSString(libSequence)) + ";";
                    // Step 3.b
                    if (libSequence.indexOf(minimizedSequence) != -1) {
                        var ind = libSequence.indexOf(minimizedSequence) + minimizedSequence.length;
                        var ind2 = libSequence.indexOf(";", ind);
                        if (ind2 < ind) continue;
                        // foundPatternNextString is the next frame in a pattern that matches the input sequence.
                        var foundPatternNextString = libSequence.substring(ind, ind2);
                        // Step 3.c
                        if (!retArray.includes(foundPatternNextString)) retArray.push(foundPatternNextString);
                        // Step 3.b
                        if (retArray.length==numberNotes) return retArray;
                    }
                }
            }
            // Step 4.
            return retArray;
        }

        // This function minimizes a SongString.
        function minimizeSString(inputString) {
            if (inputString.indexOf(";") == -1) return inputString;
            var items = inputString.split(";");
            var canBeCompressed = true;
            var outArray = [];
            for (var i = 0; i < Math.ceil((items.length) / 2); i++) {
                // See if lowering the resolution will lose data
                var dP1 = items[2 * i];
                var dP2 = items[2 * i + 1];
                var pushItem;
                if (dP1 == undefined && dP2 == undefined) {
                    // Push nothing
                    pushItem = "";
                }
                if (dP1 != undefined && dP2 == undefined) {
                    pushItem = dP1;
                }
                if (dP1 == undefined && dP2 != undefined) {
                    pushItem = dP2;
                }
                if (dP1 != undefined && dP2 != undefined) {
                    // Now see if either is empty.
                    if (dP1 == "" && dP2 != "")
                        pushItem = dP2;
                    else if (dP1 != "" && dP2 == "")
                        pushItem = dP1;
                    else if (dP1 == "" && dP2 == "")
                        pushItem = "";
                    else
                        canBeCompressed = false;
                }
                outArray.push(pushItem);
            }
            var outString = "";
            for (var i = 0; i < outArray.length; i++)
                outString += outArray[i] + ";";
            outString = outString.substring(0, outString.length - 1);
            if (!canBeCompressed)
                return inputString;
            else
                return minimizeSString(outString);
        }

        // This function sorts each frame in a Song String so that notes are in ascending
        // order.
        function sortSString(input) {
            var frames = input.split(";");
            var retArray = [];
            for (var i = 0; i < frames.length; i++) {
                var frameContents = frames[i];
                if (frames[i].indexOf(",") != -1) {
                    frameContents = frames[i].split(",");
                    frameContents.sort();
                    var newFrameContents = "";
                    for (var j = 0; j < frameContents.length; j++)
                        newFrameContents += frameContents[j] + ",";
                    frameContents = newFrameContents.substring(0, newFrameContents.length - 1);
                }
                retArray.push(frameContents);
            }
            var retString = "";
            for (var k = 0; k < retArray.length; k++)
                retString += retArray[k] + ";";
            retString = retString.substring(0, retString.length - 1);
            return retString;
        }
        var arrTmp = getPredictionsD(inputSequence, pLibrary, numberNotes * 2);
        function getRandom(arr, n) {
            var result = new Array(n),
                len = arr.length,
                taken = new Array(len);
            if (n > len)
                throw new RangeError("getRandom: more elements taken than available");
            while (n--) {
                var x = Math.floor(Math.random() * len);
                result[n] = arr[x in taken ? taken[x] : x];
                taken[x] = --len;
            }
            return result;
        }
        if (arrTmp.length < numberNotes) numberNotes = arrTmp.length;
        return getRandom(arrTmp, numberNotes);
    },
	/* This is the function called back when the function returns */
	function (returnValue) {
        gotPatternPredictions(returnValue);
	}
);
