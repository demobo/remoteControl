var usePatterns = false;
var maxCircles = 2;

var canvas;
var stage;
var audio;
var image;

var barL;
var barR;
var bg;
var star;
var star2;
var bmp;
var glow;
var pos;
var playing;
var volumeData;
var scanLineImage;
var frontSphere;
var backSphere;
var light;
var circles;
var frontCircles;
var backCircles;
var scanLines;
var fpsFld;
var loadingFld;

var patterns
// var patternFilter

function changePattern(pattern) {
	var i=pattern % 5
	if (i==1) {
		drawPattern1_wrap();
	} else if (i==2) {
		drawPattern2_wrap();
	} else if (i==3) {
		drawPattern3_wrap();
	} else if (i==4) {
		drawPattern4_wrap();
	} else {
		restorePattern();
	}
}

function drawPattern5_wrap() {
	drawPattern5(gR, gG, gB);
}

function drawPattern5(r, g, b) {
	var temp = patterns.rotation;
	usePatterns = true;
	patterns.graphics.clear();
	patterns = new createjs.Shape();
	patterns.x = canvas.width / 2;
	patterns.y = canvas.height / 2;
	
	patterns.graphics.beginFill(createjs.Graphics.getRGB(r, g, b));
	patterns.compositeOperation = "lighter";

	for (var i = 0; i < 5; i++) {
		var x = Math.random() * 25;
		var y = Math.random() * 25;
		patterns.graphics.drawPolyStar(x, y, 5, 5, 0.6, -90);
	}
	
	for (var i = 0; i < 5; i++) {
		var x = Math.random() * -25;
		var y = Math.random() * 25;
		patterns.graphics.drawPolyStar(x, y, 5, 5, 0.6, -90);
	}
	
	for (var i = 0; i < 5; i++) {
		var x = Math.random() * -25;
		var y = Math.random() * -25;
		patterns.graphics.drawPolyStar(x, y, 5, 5, 0.6, -90);
	}
	
	for (var i = 0; i < 5; i++) {
		var x = Math.random() * 25;
		var y = Math.random() * -25;
		patterns.graphics.drawPolyStar(x, y, 5, 5, 0.6, -90);
	}

	patterns.rotation = temp;
	stage.addChild(bg, glow, backCircles, backSphere, light, frontSphere, frontCircles, patterns, scanLines, fpsFld);
};


function drawPattern4_wrap() {
	drawPattern4(gR, gG, gB);
}

function drawPattern4(r, g, b) {
	var temp = patterns.rotation;
	usePatterns = true;
	patterns.graphics.clear();
	patterns = new createjs.Shape();
	patterns.x = canvas.width / 2;
	patterns.y = canvas.height / 2;
	
	patterns.graphics.setStrokeStyle(2,'round','round');
	patterns.graphics.beginStroke(createjs.Graphics.getRGB(r, g, b));
	patterns.compositeOperation = "lighter";
	

	var oldx=patterns.x;
	var oldy=patterns.y;

	for (var t = 0; t < 50; t++) {
		var radius = 0.1;
		var ang = 360 * t;
		var s = 2 * Math.PI * radius * t;
		var x0 = s * Math.cos(ang);
		var y0 = s * Math.sin(ang);
		var x = x0 + s * Math.sin(ang);
		var y = y0 - s * Math.cos(ang);
		var z = 0;
		patterns.graphics.moveTo(x0, y0).lineTo(x, y, x0, y0);
		oldx=x;
		oldy=y;
	}

	patterns.rotation = temp;
	stage.addChild(bg, glow, backCircles, backSphere, light, frontSphere, frontCircles, patterns, scanLines, fpsFld);
};


function drawPattern3_wrap() {
	drawPattern3(gR, gG, gB);
}

function drawPattern3(r, g, b) {
	var temp = patterns.rotation;
	usePatterns = true;
	patterns.graphics.clear();
	patterns = new createjs.Shape();
	patterns.x = canvas.width / 2;
	patterns.y = canvas.height / 2;
	
	patterns.graphics.setStrokeStyle(2);
	patterns.graphics.beginStroke(createjs.Graphics.getRGB(r, g, b));
	patterns.compositeOperation = "lighter";

	for (var i = 0; i < 20; i++) {
		var j = 18 * i;
		var x = 20 * Math.cos(j);
		var y = 20 * Math.sin(j);
		patterns.graphics.drawCircle(x, y, 18);
	}
	
	patterns.rotation = temp;
	stage.addChild(bg, glow, backCircles, backSphere, light, frontSphere, frontCircles, patterns, scanLines, fpsFld);
};


function drawPattern1_wrap() {
	drawPattern1(gR, gG, gB);
}

function restorePattern() {
	usePatterns = false;
	patterns.graphics.clear();
	refleshSphere();
	stage.addChild(bg, glow, backCircles, backSphere, light, frontSphere, frontCircles, patterns, scanLines, fpsFld);
}

function drawPattern1(r, g, b) {
	var temp = patterns.rotation;
	usePatterns = true;
	patterns.graphics.clear();
	patterns = new createjs.Shape();
	patterns.x = canvas.width / 2;
	patterns.y = canvas.height / 2;
	patterns.graphics.setStrokeStyle(5);
	patterns.graphics.beginStroke(createjs.Graphics.getRGB(r, g, b));
	patterns.compositeOperation = "lighter";

	for (var i = 0; i < 4; i++) {
		var j = i * 8;
		patterns.graphics.moveTo(j, -28);
		patterns.graphics.lineTo(j, 28);
		patterns.graphics.moveTo(-j, -28);
		patterns.graphics.lineTo(-j, 28);
	}

	// circle = new createjs.Shape();
	// circle.x = 150;
	// circle.y = 150;
	// circle.graphics.beginFill("black").drawCircle(0, 0, 70);

	// stage.addChild(circle,patterns);
	patterns.rotation = temp;
	stage.addChild(bg, glow, backCircles, backSphere, light, frontSphere, frontCircles, patterns, scanLines, fpsFld);
}

function drawPattern2_wrap() {
	drawPattern2(gR, gG, gB);
}

function drawPattern2(r, g, b) {
	var temp = patterns.rotation;
	usePatterns = true;
	patterns.graphics.clear();
	patterns = new createjs.Shape();
	patterns.x = canvas.width / 2;
	patterns.y = canvas.height / 2;
	

	for (var i = 1; i < 10; i++) {
		var j = 37 * i;
		// first round
		var x=15 * Math.cos(j);
		var y=15 * Math.sin(j);
		patterns.graphics.beginFill(createjs.Graphics.getRGB(r, g, b)).drawCircle(x, y, 3.5);
	}
	for (var i = 1; i < 20; i++) {
		var j = 17 * i;
		// second round
		x=25 * Math.cos(j);
		y=25 * Math.sin(j);
		patterns.graphics.beginFill(createjs.Graphics.getRGB(r, g, b)).drawCircle(x, y, 2.2);
	}
	for (var i = 1; i < 40; i++) {
		var j = 360/40 * i;
		// third round
		x=35 * Math.cos(j);
		y=35 * Math.sin(j);
		patterns.graphics.beginFill(createjs.Graphics.getRGB(r, g, b)).drawCircle(x, y, 2.2);
	}
	
	patterns.compositeOperation = "lighter";
	// stage.addChild(circle,patterns);
	patterns.rotation = temp;
	stage.addChild(bg, glow, backCircles, backSphere, light, frontSphere, frontCircles, patterns, scanLines, fpsFld);
}

function init() {
	// create a new stage and point it at our canvas:
	canvas = document.getElementById("visualizer");
	stage = new createjs.Stage(canvas);
	stage.autoClear = false;
	audio = document.getElementById("music");

	var w = canvas.width;
	var h = canvas.height;
	
	scanLineImage=document.getElementById('grid');
	loadMusic();

	//start ticking!

	var screen = new createjs.Shape();
	screen.graphics.beginFill("rgba(16,16,16,0.25)").drawRect(0, 0, w + 1, h + 1);

	star = new createjs.Shape();
	star.graphics.beginFill(createjs.Graphics.getRGB(40, 40, 40, 0.03)).drawPolyStar(0, 0, h * 0.7, 48, 0.95);
	star.graphics.beginFill(createjs.Graphics.getRGB(40, 40, 40, 0.18)).drawPolyStar(0, 0, h * 0.75, 6, 0.93);
	star.graphics.beginFill(createjs.Graphics.getRGB(40, 40, 40, 0.05)).drawPolyStar(0, 0, h * 0.72, 24, 0.93);
	star.compositeOperation = "lighter";
	star2 = star.clone();
	star2.alpha = 0.4;
	bg = new createjs.Container();
	bg.addChild(star, star2);

	fpsFld = new createjs.Text("", "10px Arial", "#FFF");
	fpsFld.alpha = 0.4;
	fpsFld.x = 20;
	fpsFld.y = 26;

	var r = 40;
	backSphere = new createjs.Shape();
	backSphere.graphics.beginFill("#000").drawCircle(0, 0, r);

	frontSphere = new createjs.Shape();
	frontSphere.graphics.beginRadialGradientFill(["rgba(40,40,40,0.6)", "rgba(0,0,0,0)"], [0, 1], -r * 0.2, -r * 0.2, 0, -r * 0.1, -r * 0.1, r);
	frontSphere.graphics.drawCircle(0, 0, r);

	glow = new createjs.Shape();
	glow.graphics.beginRadialGradientFill(["rgba(0,0,0,0.5)", "rgba(180,180,180,0)"], [0, 1], 0, 0, 0, 0, 0, w / 2).drawCircle(0, 0, w / 2);
	glow.graphics.beginFill("rgba(0,0,0,0.1)").drawCircle(0, 0, r * 3);
	glow.graphics.beginFill("rgba(0,0,0,0.1)").drawCircle(0, 0, r * 2);
	glow.compositeOperation = "lighter";

	light = new createjs.Shape();
	light.graphics.beginFill("rgba(220,220,220,1)").drawCircle(0, 0, r);
	light.x = backSphere.x = glow.x = frontSphere.x = w / 2;
	light.y = backSphere.y = glow.y = frontSphere.y = h / 2;
	light.compositeOperation = "lighter";

	scanLines = new createjs.Shape();

	bg.x = canvas.width / 2;
	bg.y = canvas.height / 2;
	bg.scaleX = canvas.width / canvas.height;

	frontCircles = new createjs.Container();
	backCircles = new createjs.Container();
	frontCircles.x = backCircles.x = w / 2;
	frontCircles.y = backCircles.y = h / 2;

	loadingFld = new createjs.Text("loading music", "24px Arial", "#333");
	loadingFld.textAlign = "center";
	loadingFld.textBaseline = "middle";
	loadingFld.x = w / 2;
	loadingFld.y = h / 2;

	stage.addChild(screen, fpsFld, loadingFld);
	stage.update();

	patterns = new createjs.Shape();

	circles = [];

	createjs.Ticker.setFPS(15);

}

function refleshSphere() {
	//remove all graphics
	glow.graphics.clear();
	frontSphere.graphics.clear();
	backSphere.graphics.clear();
	light.graphics.clear();

	//draw new graphics
	var w = canvas.width;
	var h = canvas.height;
	var r = 40;
	backSphere = new createjs.Shape();
	var tR = gR;
	var tG = gG;
	var tB = gB;
	if (usePatterns) {
		tR = 0;
		tG = 0;
		tB = 0;
	}
	backSphere.graphics.beginFill(createjs.Graphics.getRGB(tR, tG, tB, 0.6)).drawCircle(0, 0, r);

	frontSphere = new createjs.Shape();
	frontSphere.graphics.beginRadialGradientFill(["rgba(0,0,0,0)", createjs.Graphics.getRGB(tR, tG, tB, 0.3)], [0, 1], -r * 0.2, -r * 0.2, 0, -r * 0.1, -r * 0.1, r);
	frontSphere.graphics.drawCircle(0, 0, r);

	glow = new createjs.Shape();
	glow.graphics.beginRadialGradientFill([createjs.Graphics.getRGB(gR - 10, gG - 20, gB - 50, 1), "rgba(0,0,0,0)"], [0, 1], 0, 0, 0, 0, 0, w / 2).drawCircle(0, 0, w / 2);
	glow.graphics.beginFill("rgba(0,0,0,0.1)").drawCircle(0, 0, r * 3);
	glow.graphics.beginFill("rgba(0,0,0,0.1)").drawCircle(0, 0, r * 2);
	glow.compositeOperation = "lighter";

	light = new createjs.Shape();
	light.graphics.beginFill(createjs.Graphics.getRGB(gR, gG, gB, 0.6)).drawCircle(0, 0, r);
	light.x = backSphere.x = glow.x = frontSphere.x = w / 2;
	light.y = backSphere.y = glow.y = frontSphere.y = h / 2;
	light.compositeOperation = "lighter";

	stage.addChild(bg, glow, backCircles, backSphere, light, frontSphere, frontCircles, patterns, scanLines, fpsFld);
}

function addCircle() {
	var circle = new createjs.Shape();
	circle.compositeOperation = "lighter";
	circle.graphics.beginFill(createjs.Graphics.getRGB(gR, gG, gB, Math.random() * 0.1 + 0.1)).drawCircle(0, 0, 50);
	circle.graphics.beginFill(createjs.Graphics.getRGB(gR, gG, gB, Math.random() * 0.2 + 0.2), 100, Math.random() * 5 + 90, 1).drawPolyStar(0, 0, 20, 6);
	var a = Math.random() * Math.PI * 2;
	var d = Math.random() * 110 + 40;
	circle._x = Math.cos(a) * d;
	circle._y = Math.sin(a) * d;
	circle.z = Math.random() * 50 + 100;
	a = Math.random() * Math.PI * 2;
	d = Math.random() * 15 + 10;
	circle.velX = Math.cos(a) * d;
	circle.velY = Math.sin(a) * d;
	circle.velZ = Math.random() * 30 - 15;
	circle.alpha = 0.5;
	circles.push(circle);
}

function removeCircle() {
	if (circles.length == 0) {
		return;
	}
	var circle = circles.pop();
	if (circle.parent) {
		circle.parent.removeChild(circle);
	}
}

function loadMusic() {
	playing = false;
	// createjs.Ticker.addListener(window);
	createjs.Ticker.addEventListener("tick", tick);
	//globalFilter=new createjs.ColorFilter(1,1,1,1);
	//stage.filters=[globalFilter];
	//stage.cache(0,0,360,480);
}

function tick() {
	//	fpsFld.text = Math.round(Ticker.getMeasuredFPS())+"fps";

	if (!playing) {
		playing = true;
		//		volumeData = new VolumeData(image);
		//		volumeData.gain = 2;
		//		audio.play();
		scanLines.graphics.beginBitmapFill(scanLineImage).drawRect(0, 0, canvas.width + 1, canvas.height + 1);
		stage.removeChild(loadingFld);
		stage.addChild(bg, glow, backCircles, backSphere, light, frontSphere, frontCircles, scanLines, fpsFld);
		stage.clear();
	}
	if (!playing) {
		return;
	}

	//	var t = audio.currentTime;
	//	var vol = volumeData.getVolume(t);
	//	var avgVol = volumeData.getAverageVolume(t-0.1,t);
	//	var volDelta = volumeData.getVolume(t-0.05);
	//	volDelta.left = vol.left-volDelta.left;
	//	volDelta.right = vol.right-volDelta.right;

	var vol = {
		left : curPower,
		right : curPower
	};
	var avgVol = {
		left : (olderPower + oldPower + curPower) / 3,
		right : (olderPower + oldPower + curPower) / 3
	};
	var volDelta = {
		left : curPower - oldPower,
		right : curPower - oldPower
	};

	star.rotation += avgVol.right * avgVol.left * 4 - 0.3;
	star2.rotation = -star.rotation;
	glow.alpha = vol.right;
	light.alpha = avgVol.right * avgVol.left;
	glow.scaleX = glow.scaleY = star.scaleX = star.scaleY = vol.right * vol.right * 0.8 + 0.5;
	bg.alpha = vol.left * 0.5 - 0.1;
	scanLines.alpha = 1 - vol.right * vol.left * 0.7;
	frontSphere.alpha = Math.min(1, 3 - light.alpha * 2.6);

	var s = avgVol.right * avgVol.right * 0.8 + 0.3;
	frontCircles.scaleX = frontCircles.scaleY = backCircles.scaleX = backCircles.scaleY = Math.max(s, backCircles.scaleX + (s - backCircles.scaleX) * 0.1);
	frontSphere.scaleX = frontSphere.scaleY = backSphere.scaleX = backSphere.scaleY = light.scaleX = light.scaleY = Math.max(s, backCircles.scaleX + (s - backCircles.scaleX) * 0.1) * 2.5;
	// old instant method
	// frontSphere.scaleX = frontSphere.scaleY = backSphere.scaleX = backSphere.scaleY = light.scaleX = light.scaleY = 1 + avgVol.right * avgVol.right * 0.6;

	var l = circles.length;

	var c = 0.4;
	while (l < maxCircles && volDelta.right + volDelta.left > c) {
		addCircle();
		c += 0.4;
		l++;
	}

	var max = (avgVol.right + avgVol.left) / 2 * maxCircles;
	var focalDistance = 700;
	for (var i = l - 1; i >= 0; i--) {
		var circle = circles[i];
		circle.velX += circle.x * -0.005;
		circle.velY += circle.y * -0.005;
		circle.velZ += circle.z * -0.005;
		circle._x += circle.velX;
		circle._y += circle.velY;
		circle.z += circle.velZ;
		var p = focalDistance / (circle.z + 400);
		circle.x = circle._x * p;
		circle.y = circle._y * p;
		circle.scaleX = circle.scaleY = (vol.left * vol.left * 1.1 + 0.4) * p * 2;
		circle.alpha = vol.left + vol.right + 0.4;
		// if (circle.z > 0) {
		if (Math.sqrt(circle.x * circle.x + circle.y * circle.y) < 120 || (Math.random() < 0.15 && circle.z >= 5) && l > max) {
			if (circle.parent) {
				circle.parent.removeChild(circle);
			}
			circles.splice(i, 1);
		} else {
			backCircles.addChild(circle);
		}
		// } else {
		// frontCircles.addChild(circle);
		// }
	}

	//for patterns inside sphere
	patterns.rotation += 5;
	patterns.scaleX = patterns.scaleY = Math.max(s, backCircles.scaleX + (s - backCircles.scaleX) * 0.1) * 2.3;
	//patterns.updateCache();
	stage.update();
}

var syncEnable = true;

function changeColor(color) {
	gR = color.r;
	gG = color.g;
	gB = color.b;
	refleshSphere();
}

function loadSongInfo(songs) {
	if ($.isArray(songs)) {
		var song = songs[0];
		var nextSong = songs[1];
	} else
		var song = songs;
	flipAlbumArt();
	$('#songName').text(song.title);
	$('#artist').text(song.artist);
	$('img.currentAlbumArt').attr('src', song.image);
}

//function handler of img onload event
function flipAlbumArt() {
	$('img.currentAlbumArt').toggleClass('to90 to0').bind('webkitTransitionEnd', function() {
		setTimeout(function() {
			$('img.currentAlbumArt').toggleClass('to90 to0');
		}, 0);
		$(this).unbind('webkitTransitionEnd');
	});
}

function syncState(state) {
	if (state.isPlaying) {
		if (state.color)
			changeColor(state.color);
		changePattern(state.pattern);
		oldPower = state.oldPower;
		curPower = state.curPower;
	} else {
	}
}

