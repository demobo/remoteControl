(function() {
	if (DEMOBO) {
		DEMOBO.developer = 'developer@demobo.com';
		DEMOBO.maxPlayers = 1;
		DEMOBO.stayOnBlur = true;
		DEMOBO.autoConnect = false;
		DEMOBO.init = init;
		demobo.start();
	}
	demoboLoading = undefined;

	var ui = {
			name: 				'douban',
			version: 			'0301'
		};
	ui.controllerUrl = "http://rc1.demobo.com/rc/"+ui.name+"?"+ui.version;
		
	// do all the iniations you need here
	function init() {
		demobo.setController( {
			url : ui.controllerUrl,
			orientation: 'portrait'
		});
		// your custom demobo input event dispatcher
		demobo.mapInputEvents( {
			'playPauseButton' : playPause,
			'playButton' : playPause,
			'pauseButton' : playPause,
			'loveButton' : love,
			'spamButton' : ban,
			'nextButton' : next,
			'channelTab' : sendStationList,
			'stationItem' : chooseStation,
			'volumeSlider' : setVolume,
			'demoboVolume' : onVolume,
			'demoboApp' : function() {
				refreshController();
				hideDemobo();
			}
		});
		showDemobo();
		setupSongUpdateListener();
	}

	// ********** custom event handler functions *************
	function playPause() {
		DBR.act('pause');
		syncState();
	}

	function next() {
		DBR.act('skip');
	}

	function love() {
		DBR.act('love');
	}

	function ban() {
		DBR.act('ban');
	}
	
	function setVolume(num) {
		num = parseInt(num / 10) * 10;
//		getLFMControls()._setVolume(num, true);
		syncState();
	}
	
	function onVolume(value) {
		if (value=='up') setVolume(parseInt(getVolume())+10);
		else if (value=='down') setVolume(parseInt(getVolume())-10);
		else setVolume(value*100);
	}
	
	function sendStationList() {
		var list = $.map($('.channel'), function(value, index) {
			var s = {
				'title' : $(value).find('.chl_name').text()
			};
			if ($(value).hasClass('selected'))
				s.selected = true;
			return s;
		});
		demobo.callFunction('loadChannelList', list);
	}

	function chooseStation(index) {
		index = parseInt(index);
		$($('.chl_name')[index]).trigger('click');
	}

	function refreshController() {
		console.log('refresh');
		sendStationList();
		sendNowPlaying();
	}

	/* helpers */
	function setupSongUpdateListener() {
		// make sure the target is an element that will not be destroyed after
		// meta data updates
		var _this = {
			target : $('head title')[0],
			oldValue : document.title
		};
		_this.onChange = function() {
			if (_this.oldValue !== document.title) {
				_this.oldValue = document.title;
				sendNowPlaying();
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, 1);
		};
		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
	}
	function getNowPlayingData() {
		var temp = FM.getCurrentSongInfo();
		return {
			'title' : temp['songName'],
			'artist' : temp['artistName'],
			'image' : temp['coverUrl']
		};
	}

	function getCurrentStationIndex() {
		var toReturn = 0;
		var list = $.map($('.channel'), function(value, index) {
			if ($(value).hasClass('selected'))
				toReturn = index;
		});
		return toReturn;
	}

	function sendNowPlaying() {
		demobo.callFunction('loadSongInfo', getNowPlayingData());
		demobo.callFunction('setCurrentChannel', getCurrentStationIndex());
		syncState();
	}
	
	function syncState(e) {
		setTimeout(function() {
			curState = {isPlaying: getIsPlaying(), volume: getVolume()};
			demobo.callFunction('syncState', curState);
		}, 30);
	}
	function getIsPlaying() {
		return !DBR.is_paused();
	}
	function getVolume() {
		return 50;
	}
})();