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
			url : "http://rc1.demobo.com/rc/douban?0924"
		});
		// your custom demobo input event dispatcher
		demobo.inputEventDispatcher.addCommands( {
			'playPauseButton' : playPause,
			'loveButton' : love,
			'spamButton' : ban,
			'nextButton' : next,
			'channelTab' : sendStationList,
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
		DBR.act('pause');
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
	}
})();