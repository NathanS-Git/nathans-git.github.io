// This section is in charge of manipulating which song is currently selected to play

var previousSong;
var songList = JSON.parse(sessionStorage.getItem("playlist"));
var found;

var prevTime = 0;
var changedBg = false;

function playSong(element) {
    if (changedBg == false) {
        document.getElementById('albumbg').style.display = 'initial';
        document.getElementById('bg').style.opacity = 0;
        var rgb = getAverageRGB(document.querySelector('img'));
        document.body.style.setProperty('--text-colour','rgb('+(rgb.r+20)+','+(rgb.g+20)+','+(rgb.b+20)+')');
        document.body.style.setProperty('--htext-colour','rgb('+(rgb.r)+','+(rgb.g)+','+(rgb.b)+')');
        changedBg = true;
    }
    
    try {
		previousSong.style.color = 'var(--text-colour)';
		previousSong.style.fontWeight = '';
	} catch(err) {}
	
	var audioPlayer = document.getElementsByTagName('audio')[0];
	previousSong = element;
	audioPlayer.src = element.id;
    element.style.fontWeight = 'bolder';
    element.style.color = 'var(--htext-colour)';
	audioPlayer.play();

	songList = document.getElementsByTagName('button');

	for (var i = 0; i < songList.length; i++) {
		if (element.id == songList[i].id) {
			found = i;
			break;
		}
	}

	audioPlayer.onended = function() {
        if (found+1 >= songList.length) {
            playSong(songList[0])
        }
        else {
            playSong(songList[found+1]);
        }
	}
}

// This section is in charge of moving aesthetics
function turnToMouse(element, event) {
	var time = (new Date()).getTime();

    // Make transition smoother upon entering
	if (time-prevTime <= 110) { 
		element.style.transition = 'transform 0.1s';
	} else {
		element.style.transition = 'transform 0s';
	}

	mouseX = event.clientX;
	mouseY = event.clientY;

    element_data = element.getBoundingClientRect();
    center_x = (element_data.bottom-element_data.top)/2
    center_y = (element_data.right-element_data.left)/2
	y = -1*(mouseY-((center_x)+element_data.top));
	x = mouseX-((center_y)+element_data.left);
	angle = Math.sqrt(x*x + y*y)/12;
    element.style.transform = 'rotate3d('+y+','+x+',0,'+angle+'deg) translate('+x/40+'px,'+-y/40+'px)';
    //element.style.filter = "brightness("+(((y+center_x)/900)+0.75)+")";
}

function showSongs(element) {
    element.style.opacity = 0.1;
    element.style.zIndex = -1;
}

function hideSongs(element) {
    element.style.zIndex = 0;
    element.style.opacity = 1;
}

function mouseEnter() {
	var time = (new Date()).getTime();
	prevTime = time;
}

function mouseLeave(element) {
	element.style.transition = 'transform 1s';
}

function reset(element) {
    element.style.transform = 'rotate3d(0,0,0,0)';
    //element.style.filter = "brightness(1)";
}

function changePalette() {
    document.body.style.setProperty('--text-colour','#FFFFFF');
    document.body.style.setProperty('--htext-colour','#FFFFFF')
}

// Taken from https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript
function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb
}


function addToPlaylist(element) {
    try {
        songList = JSON.parse(sessionStorage.getItem("playlist"));
        songList.push(element.id);
    } catch (TypeError) {
        songList = [];
        songList.push(element.id);
    }
    sessionStorage.clear()
    sessionStorage.setItem("playlist", JSON.stringify(songList))
}

