(function() {
	if (DEMOBO) {
		DEMOBO.developer = 'developer@demobo.com';
		DEMOBO.maxPlayers = 1;
		DEMOBO.stayOnBlur = true;
		DEMOBO.init = init;
		demobo.start();
	}
	demoboLoading = undefined;
	var last3PlayedSongs = [];
	
	// do all the iniations you need here
	function init() {
		demobo.setController( {
			url : "http://rc1.demobo.com/rc/pandora?10082012"
		});
		// your custom demobo input event dispatcher
		demobo.inputEventDispatcher.addCommands( {
			'playButton' : play,
			'pauseButton' : pause,
			'loveButton' : thumbUp,
			'spamButton' : thumbDown,
			'nextButton' : next,
			'volumeSlider' : setVolume,
			'stationItem' : chooseStation,
			'demoboApp' : function() {
				refreshController();
				hideDemobo();
			}
		});
		showDemobo();
		setupSongUpdateListener();
		setupStationUpdateListener();
	}

	// ********** custom event handler functions *************
	function play() {
		$('.playButton').click();
	}

	function pause() {
		$('.pauseButton').click();
	}

	function next() {
		$('.skipButton').click();
	}

	function thumbUp() {
		$('.thumbUpButton').click();
	}

	function thumbDown() {
		$('.thumbDownButton').click();
	}

	function setVolume(num) {
		num = parseInt(num);
		$('.volumeBackground').show();
		var min = getAbsPosition($('.volumeBar')[0]).left + 22;
		var max = min + $('.volumeBar').width();
		var target = Math.floor(num / 100.0 * (max - min)) + min - 22;
		$('.volumeBackground').show().trigger( {
			type : 'click',
			pageX : target
		});
	}

	function chooseStation(index) {
		index = parseInt(index);
		$($('.stationName')[index]).find('#shuffleIcon,.stationNameText').click();
	}

	function refreshController() {
		sendStationList();
		setTimeout(sendLast3,100);
	}

	/* helpers */
	function setupSongUpdateListener() {
		// make sure the target is an element that will not be destroyed after
		// meta data updates
		var _this = {
			target : $('.albumArt')[0],
			oldValue : $('.playerBarArt').attr('src')
		};
		_this.onChange = function() {
			var newValue = $('.playerBarArt').attr('src');
			if (newValue) {
				if (_this.oldValue == newValue && newValue.substr(0,4)!="http" && _this.oldTitle != $('.songTitle').text()) {
					_this.oldTitle = $('.songTitle').text();
					setTimeout(sendNowPlaying,300);
				} else if (_this.oldValue != newValue) {
					_this.oldValue = newValue;
					sendNowPlaying();
				}
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, 30);
		};
		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
	}
	function setupStationUpdateListener() {
		// make sure the target is an element that will not be destroyed after
		// meta data updates
		var _this = {
			target : $('.middlecolumn')[0],
			oldValue : $('.stationChangeSelector .textWithArrow').text()
		};
		_this.onChange = function() {
			var newValue = $('.stationChangeSelector .textWithArrow').text();
			if (newValue) {
				if (_this.oldValue != newValue) {
					_this.oldValue = newValue;
					sendStationList();
				}
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, 30);
		};
		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
	}
	function getAbsPosition(element) {
		if (element) {
			var oLeft = 0;
			var oTop = 0;
			var o = element;
			do {
				oLeft += o.offsetLeft;
				oTop += o.offsetTop;
			} while (o = o.offsetParent);
			return {
				'left' : oLeft,
				'top' : oTop
			};
		} else {
			return {};
		}
	}

	function getNowPlayingData() {
		return last3PlayedSongs;
	}
	
	function getCurrentSong() {
		var imageURL = $('.playerBarArt').attr('src');
		if (!imageURL) return;
		if (imageURL.substr(0,4)!='http') imageURL = document.location.origin + imageURL;
		return {
			'title' : $('.songTitle').text(),
			'artist' : $('.artistSummary').text(),
			'album' : $('.albumTitle').text(),
			'image' : imageURL
		};
	}

	function getStationList() {
		var toReturn = [];
		$.each($('.stationListItem'), function(index,
				elem) {
			var s = {
				'title' : $(elem).find('.stationName').text().trim()
			};
			if ($(elem).hasClass('selected'))
				s.selected = true;
			toReturn.push(s);
		});
		return toReturn;
	}

	function getCurrentStationIndex() {
		var toReturn = 0;
		$.each($('.stationListItem'), function(index,
				elem) {
			if ($(elem).hasClass('selected'))
				toReturn = index;
		});
		return toReturn;
	}

	function sendStationList() {
		demobo.callFunction('loadChannelList', getStationList());
//		demobo.callFunction('setCurrentChannel', getCurrentStationIndex());
	}

	function sendNowPlaying() {
		var curSong = getCurrentSong();
		if (!curSong) return;
		if (!last3PlayedSongs.length || last3PlayedSongs[last3PlayedSongs.length-1].title != curSong.title) {
			last3PlayedSongs.push(curSong);
			while (last3PlayedSongs.length>3) {
				last3PlayedSongs.shift();
			}
		}
		demobo.callFunction('loadSongInfo', curSong);
	}
	function sendLast3() {
		if (last3PlayedSongs.length) var curSong = last3PlayedSongs;
		else {
			var curSong = getCurrentSong();
			if (!curSong) return;
			last3PlayedSongs.push(curSong);
		}
		demobo.callFunction('loadSongInfo', curSong);
	}
})();