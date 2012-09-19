(function() {
	if (DEMOBO) {
		DEMOBO.developer = 'developer@demobo.com';
		DEMOBO.maxPlayers = 1;
		DEMOBO.stayOnBlur = true;
		DEMOBO.init = init;
		demobo.start();
	}
	demoboLoading = undefined;

	// do all the iniations you need here
	function init() {
		demobo.setController( {
			url : "http://rc1.demobo.com/rc/lastfm?0918"
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
			'nowPlayingTab' : refreshController,
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
		// getLFMPlayer().pause();
		// getLFMPlayer().unpause();
		jQuery('#radioControlPause:visible, #radioControlPlay:visible').click();
	}

	function next() {
		jQuery('#radioControlSkip').click();
	}

	function love() {
		jQuery('#radioPlayer:not(.loved) #radioControlLove').click();
	}

	function spam() {
		jQuery('#radioControlBan').click();
	}

	function setVolume(num) {
		num = parseInt(num / 10) * 10;
		getLFMControls()._setVolume(num, true);
	}

	function sendNowPlaying() {
		var nowplayingdata = getNowPlayingData();
		if (!nowplayingdata)
			return;
		demobo.callFunction('loadSongInfo', nowplayingdata);
		demobo.callFunction('setCurrentChannel', getCurrentStationIndex());
	}

	function refreshController() {
		console.log('refresh');
		sendStationList();
		sendNowPlaying();
	}

	/* helpers */
	function setupSongUpdateListener() {
		// make sure the target is an element that will not be destroyed after
		// meta
		// data updates
		var _this = {
			target : jQuery('#radioTrackMeta')[0],
			oldValue : jQuery('#nowPlayingMeta img').attr('src')
		};
		_this.onChange = function() {
			var newValue = jQuery('#nowPlayingMeta img').attr('src');
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
		if (!jQuery('#radioTrackMeta .track').text())
			return null;
		var imgURL = jQuery('#trackAlbum .albumCover img').attr('src')
				|| jQuery('#nowPlayingMeta img').attr('src');
		return {
			'title' : jQuery('#radioTrackMeta .track').text(),
			'artist' : jQuery('#radioTrackMeta .artist').text(),
			'album' : jQuery('#radioTrackMeta .album .title').text(),
			'image' : imgURL.replace('64s', '174s')
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

	function getLFMControls() {
		return LFM.Flash.Player.observers[0].controls;
	}

	function getLFMPlayer() {
		return LFM.Flash.Player.observers[0].player;
	}
})();