function setDemoboController() {
	demobo.setController( {
		url : "http://yourController.html"
	});
}

function demoboInitiation() {

}

//your custom demoboApp event dispatcher
demoboInputDispatcher.addCommands( {
	'playButton' : play,
	'pauseButton' : pause,
	'nextButton' : next,
	'loveButton' : love,
	'spamButton' : spam,
	'demoboApp' : sendCurrentSongInfo
});

// ********** finish the functions *************
function play() {

}

function pause() {

}

function next() {

}

function love() {

}

function spam() {

}

function sendCurrentSongInfo() {
	demobo.callFunction('loadSongInfo', getNowPlayingData());
}

/* helpers */
function getNowPlayingData() {

}

function setDevice(data) {
	if (data) {
		console.log(data);
		hideDemobo();
	}
}

// dont modify the codes below if you dont know what you are doing
(function() {
	if (DEMOBO) {
		DEMOBO.developer = 'developer@demobo.com';
		DEMOBO.maxPlayers = 1;
		DEMOBO.stayOnBlur = true;
		DEMOBO.autoConnect = false;
		DEMOBO.init = function() {
			setDemoboController();
			demobo.addEventListener('input', function(e) {
				console.log(e);
				demoboInputDispatcher.execCommand(e.source, e.value);

			});
			demobo.addEventListener('connected', function(e) {
				console.log('connected');
			});
			showDemobo();
			demobo.getDeviceInfo('', 'setDevice');
		}
		demobo.start();
	}
	demoboInitiation();
	demoboLoading = undefined;
})();