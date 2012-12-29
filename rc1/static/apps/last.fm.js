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
	var curState = {isPlaying: false, volume: 50};
	var slideChangeTimeout = null;
	
	var ui = {
		name: 				'lastfm',
		version: 			'1119',
		playPauseButton: 	'#radioControlPause:visible, #radioControlPlay:visible',
		playButton: 		'#radioControlPlay',
		pauseButton: 		'#radioControlPause',
		nextButton: 		'#radioControlSkip',
		previousButton: 	'',
		likeButton: 		'#radioPlayer:not(.loved) #radioControlLove',
		dislikeButton:		'#radioControlBan',
		volume:				'#radioControlVolSlider',
		title: 				'#radioTrackMeta .track',
		artist: 			'#radioTrackMeta .artist',
		album: 				'#radioTrackMeta .album .title',
		coverart:			'#trackAlbum .albumCover img, #nowPlayingMeta img',
		songTrigger: 		'#radioTrackMeta',
		stationTrigger: 	'',
		selectedStation:	'',
		stationCollection:	'#recentStationsList li',
		albumCollection:	'',
		playlistTrigger: 	''
	};
	ui.controllerUrl = "http://rc1.demobo.com/rc/"+ui.name+"?"+ui.version;
	
	// do all the iniations you need here
	function init() {
		demobo.setController( {
			url : ui.controllerUrl
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
		setupSongTrigger();
		setupStateTrigger();
	}

	// ********** custom event handler functions *************
	function playPause() {
		// getLFMPlayer().pause();
		// getLFMPlayer().unpause();
		jQuery(ui.playPauseButton).click();
	}

	function next() {
		jQuery(ui.nextButton).click();
	}

	function love() {
		jQuery(ui.likeButton).click();
	}

	function spam() {
		jQuery(ui.dislikeButton).click();
	}

	function setVolume(num) {
		num = parseInt(num / 10) * 10;
		getLFMControls()._setVolume(num, true);
		syncState();
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
		syncState();
	}

	/* helpers */
	function setupSongTrigger() {
		var triggerDelay = 30;
		var trigger = jQuery(ui.songTrigger)[0];
		var _this = {
			target : trigger,
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
			setTimeout(_this.onChange, triggerDelay);
		};
		if (_this.target)
			_this.target.addEventListener('DOMSubtreeModified', _this.delay,
					false);
	}
	function setupStateTrigger() {
		jQuery(ui.volume).on('drag mouseup', syncState);
		jQuery(document).on('click', ui.playPauseButton, syncState);
	}
	function getNowPlayingData() {
		if (!jQuery(ui.title).text())
			return null;
		var imgURL = jQuery(ui.coverart).attr('src');
		return {
			'title' : jQuery(ui.title).text(),
			'artist' : jQuery(ui.artist).text(),
			'album' : jQuery(ui.album).text(),
			'image' : imgURL.replace('64s', '174s')
		};
	}

	function getStationList() {
		var toReturn = [];
		jQuery.each(jQuery(ui.stationCollection), function(index, elem) {
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
		jQuery(jQuery(ui.stationCollection + ' a span')[index]).click();
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
	
	function syncState(e) {
		setTimeout(function() {
			curState = {isPlaying: getIsPlaying(), volume: getVolume()};
			demobo.callFunction('syncState', curState);
		}, 30);
	}
	function getIsPlaying() {
		var controls = getLFMControls();
		return controls && controls.observers[0].state == 'playing';
	}
	function getVolume() {
		return parseInt(getLFMControls().volume);
	}
})();