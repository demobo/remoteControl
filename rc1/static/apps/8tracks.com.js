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

	// do all the iniations you need here
	function init() {
		demobo.setController( {
			url : "http://rc1.demobo.com/rc/8tracks?0926"
		});
		// your custom demobo input event dispatcher
		demobo.inputEventDispatcher.addCommands( {
			'playButton' : playPause,
			'pauseButton' : playPause,
			'nextButton' : next,
			'loveButton' : love,
			'spamButton' : spam,
			'volumeSlider' : setVolume,
			'stationItem' : chooseStation,
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
		jQuery('#player_pause_button:visible, #player_play_button:visible').click();
	}

	function next() {
		jQuery('#player_skip_button').click();
	}

	function love() {
	}

	function spam() {
	}

	function setVolume(num) {
		num = parseInt(num / 10) * 10;
	}

	function sendNowPlaying() {
		var nowplayingdata = getNowPlayingData();
		if (!nowplayingdata)
			return;
		demobo.callFunction('loadSongInfo', nowplayingdata);
		demobo.callFunction('setCurrentChannel', getCurrentStationIndex());
	}

	function refreshController() {
		sendStationList();
		setTimeout(sendNowPlaying,100);
	}

	/* helpers */
	function setupSongUpdateListener() {
		// make sure the target is an element that will not be destroyed after
		// meta
		// data updates
		var _this = {
			target : document.body,
			oldValue : jQuery('.cover').attr('src')
		};
		_this.onChange = function() {
			var newValue = jQuery('.cover').attr('src');
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				refreshController();
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, 30);
		};
		if (_this.target)
			_this.target.addEventListener('DOMSubtreeModified', _this.delay,
					false);
	}
	
	function getNowPlayingData() {
		if (!jQuery('.title_artist .t').text())
			return null;
		var imgURL = jQuery('.cover').attr('src');
		return {
			'title' : jQuery('.title_artist .t').text(),
			'artist' : jQuery('.title_artist .a').text(),
			'album' : '',
			'image' : imgURL
		};
	}

	function getStationList() {
		var toReturn = [];
//		jQuery.each(jQuery('#recentStationsList li'), function(index, elem) {
//			var s = {
//				'title' : jQuery(elem).text().trim()
//			};
//			if (index == 0)
//				s.selected = true;
//			toReturn.push(s);
//		});
		return toReturn;
	}

	function chooseStation(index) {
		index = parseInt(index);
//		jQuery(jQuery('#recentStationsList li a span')[index]).click();
	}

	function getCurrentStationIndex() {
		var toReturn = 0;
		return toReturn;
	}

	function sendStationList() {
		demobo.callFunction('loadChannelList', getStationList());
	}

})();