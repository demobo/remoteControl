function setDemoboController() {
	demobo.setController( {
		url : "http://rc1.demobo.com/rc/lastfm"
	});
}

// do all the iniations you need here
function demoboInitiation() {
	// make sure the target is an element that will not be destroyed after meta
	// data updates
	var _this = {
		target : jQuery('#radioTrackMeta')[0],
		oldValue : jQuery('.albumCover .art').attr('src')
	};
	_this.onChange = function() {
		var newValue = jQuery('.albumCover .art').attr('src');
		if (newValue && _this.oldValue !== newValue) {
			_this.oldValue = newValue;
			refreshController();
		}
	};
	_this.delay = function() {
		setTimeout(_this.onChange, 30);
	};
	_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
}

// your custom demoboApp event dispatcher
demobo.mapInputEvents( {
	'playButton' : play,
	'pauseButton' : pause,
	'nextButton' : next,
	'loveButton' : love,
	'spamButton' : spam,
	'volumeSlider' : setVolume,
	'stationItem' : chooseStation,
	'nowPlayingTab' : refreshController,
	'demoboApp' : function() {
		refreshController();
		hideDemobo();
	}
});

// ********** custom event handler functions *************
function play() {
	jQuery('#radioControlPlay').click();
}

function pause() {
	jQuery('#radioControlPause').click();
}

function next() {
	jQuery('#radioControlSkip').click();
}

function love() {
	jQuery('#radioControlLove').click();
}

function spam() {
	jQuery('#radioControlBan').click();
}

function setVolume(num) {
	num = parseInt(num / 10) * 10;
	getLFMControls()._setVolume(num, true)
}

function sendNowPlaying() {
	demobo.callFunction('loadSongInfo', getNowPlayingData());
	demobo.callFunction('setCurrentChannel', getCurrentStationIndex());
}

function refreshController() {
	console.log('refresh');
	sendStationList();
	sendNowPlaying();
}

/* helpers */
function getNowPlayingData() {
	return {
		'title' : jQuery('#radioTrackMeta .track').text(),
		'artist' : jQuery('#radioTrackMeta .artist').text(),
		'album' : jQuery('#radioTrackMeta .album .title').text(),
		'image' : jQuery('#trackAlbum .albumCover img').attr('src')
	};
}

function getStationList() {
	var toReturn = [];
	jQuery.each(jQuery('#recentStationsList li'), function(index, elem) {
		var s = {
			'title' : jQuery(elem).text().trim()
		};
		if (index == 0)
			s.selected = true;
		toReturn.push(s);
	});
	return toReturn;
}

function chooseStation(index) {
	index = parseInt(index);
	jQuery(jQuery('#recentStationsList li a span')[index]).click();
}

function getCurrentStationIndex() {
	var toReturn = 0;
	return toReturn;
}

function sendStationList() {
	demobo.callFunction('loadChannelList', getStationList());
}

function setDevice(data) {
	if (data) {
		console.log(data);
		hideDemobo();
	}
}

function getLFMControls() {
	return LFM.Flash.Player.observers[0].controls;
}

function getLFMPlayer() {
	return LFM.Flash.Player.observers[0].player;
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