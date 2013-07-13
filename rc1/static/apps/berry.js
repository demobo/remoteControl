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
	var last3PlayedSongs = [];
	var curState = {isPlaying: false, volume: 50};
	var slideChangeTimeout = null;
	
	var ui = {
		name: 				'pandora',
		version: 			'0201',
		playPauseButton: 	'.playButton:visible, .pauseButton:visible',
		playButton: 		'.playButton',
		pauseButton: 		'.pauseButton',
		nextButton: 		'.skipButton',
		previousButton: 	'',
		likeButton: 		'.thumbUpButton',
		dislikeButton:		'.thumbDownButton',
		volume:				'.volumeBackground',
		title: 				'.playerBarSong',
		artist: 			'.playerBarArtist',
		album: 				'.playerBarAlbum',
		coverart:			'.stationSlides:visible .art[src], .playerBarArt',
		songTrigger: 		'#playerBar .nowplaying',
		stationTrigger: 	'.middlecolumn',
		selectedStation:	'.stationChangeSelector .textWithArrow, .stationChangeSelectorNoMenu p',
		stationCollection:	'.stationListItem .stationName',
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
		demobo.mapInputEvents( {
			'playPauseButton' : playPause,
			'playButton' : 		play,
			'pauseButton' : 	pause,
			'nextButton' : 		next,
			'loveButton' : 		like,
			'spamButton' : 		dislike,
			'volumeSlider' : 	setVolume,
			'stationItem' : 	chooseStation,
			'demoboVolume' : 	onVolume,
			'demoboApp' : 		onReady
		});
		showDemobo();
		setupSongTrigger();
		setupStationTrigger();
		setupStateTrigger();
	}

	// ********** custom event handler functions *************
	function onReady() {
		refreshController();
		hideDemobo();
	}
	function playPause() {
		$(ui.playPauseButton).click();
	}	
	function play() {
		$(ui.playButton).click();
	}
	function pause() {
		$(ui.pauseButton).click();
	}
	function next() {
		$(ui.nextButton).click();
	}
	function like() {
		$(ui.likeButton).click();
	}
	function dislike() {
		$(ui.dislikeButton).click();
	}
	function setVolume(num, evt) {
		num = parseInt(num);
		if (num==getVolume()) return;
		$(ui.volume).show();
		var min = getAbsPosition($('.volumeBar')[0]).left + 22;
		var max = (min - 22) + $('.volumeBar').width() -22;
		var target = Math.round((num / 100) * (max - min)) + min;
		$(ui.volume).show().trigger( {
			type : 'click',
			pageX : target
		});
	}
	function onVolume(value) {
		if (value=='up') setVolume(parseInt(getVolume())+5);
		else if (value=='down') setVolume(parseInt(getVolume())-5);
		else setVolume(value*100);
	}
	function chooseStation(index) {
		index = parseInt(index);
		$($(ui.stationCollection)[index]).find('#shuffleIcon,.stationNameText').click();
	}

	function refreshController() {
		sendStationList();
		setTimeout(sendLast3,100);
		syncState();
	}

	/* helpers */
	function setupSongTrigger() {
		var triggerDelay = 50;
		var longDelay = 500;
		var trigger = $(ui.songTrigger)[0];
		var _this = {
			oldCoverart : $(ui.coverart).attr('src'),
			oldTitle : $(ui.title).text()
		};
		var maxChecks = 10;
		var checkTitle = function() {
			var newTitle = $(ui.title).text();
			if (newTitle && _this.oldTitle !== newTitle) {
				_this.oldTitle = newTitle;
				checkCoverart(maxChecks);
			}
		};
		var checkCoverart = function(checksLeft) {
			var newCoverart = $(ui.coverart).attr('src');
			if (newCoverart && _this.oldCoverart !== newCoverart) {
				_this.oldCoverart = newCoverart;
				sendNowPlaying();
			} else if (checksLeft) {
				setTimeout(function(){
					checkCoverart(checksLeft-1);
				}, longDelay);
			} else {
				var newCoverart = $(ui.coverart).attr('src');
				_this.oldCoverart = newCoverart;
				sendNowPlaying();
			}
		}
		var delay = function() {
			setTimeout(checkTitle, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	}
	function setupStationTrigger() {
		var triggerDelay = 50;
		var trigger = $(ui.stationTrigger)[0];
		var _this = {
			oldValue : $(ui.selectedStation).text()
		};
		var onChange = function() {
			var newValue = $(ui.selectedStation).text();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				sendStationList();
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	}
	function setupStateTrigger() {
		$(ui.volume).on('drag click', syncState);
		$(ui.playButton + ',' + ui.pauseButton).on('click', syncState);
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
		var imgURL = $(ui.coverart).attr('src');
		if (!imgURL) return;
		if (imgURL.substr(0,4)!='http') imgURL = "http://www.pandora.com/img/no_album_art.jpg"; //document.location.origin + imgURL;
		return {
			'title' : $(ui.title).text(),
			'artist' : $(ui.artist).text(),
			'album' : $(ui.album).text(),
			'image' : imgURL
		};
	}
	function getStationList() {
		var toReturn = [];
		$.each($(ui.stationCollection), function(index,elem) {
			var s = {
				'title' : $(elem).text().trim()
			};
			if ($(elem).parent().hasClass('selected')) s.selected = true;
			toReturn.push(s);
		});
		return toReturn;
	}
	function getCurrentStationIndex() {
		var toReturn = 0;
		$.each($(ui.stationCollection), function(index,elem) {
			if ($(elem).parent().hasClass('selected')) toReturn = index;
		});
		return toReturn;
	}
	function sendStationList() {
		demobo.callFunction('loadChannelList', getStationList());
	}
	function sendNowPlaying() {
		var curSong = getCurrentSong();
		if (!curSong) return;
		if (!last3PlayedSongs.length || last3PlayedSongs[last3PlayedSongs.length-1].title != curSong.title) {
			last3PlayedSongs.push(curSong);
			while (last3PlayedSongs.length>3) {
				last3PlayedSongs.shift();
			}
		} else if (last3PlayedSongs[last3PlayedSongs.length-1].title == curSong.title) {
			last3PlayedSongs[last3PlayedSongs.length-1] = curSong;
		}
		demobo.callFunction('loadSongInfo', curSong);
		syncState();
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
	function syncState(e) {
		setTimeout(function() {
			curState = {isPlaying: getIsPlaying(), volume: getVolume()};
			demobo.callFunction('syncState', curState);
		}, 30);
	}
	
	function getIsPlaying() {
		return !$(ui.playButton+':visible').length;
	}
	function getVolume() {
		$(ui.volume).show();
		var min = getAbsPosition($('.volumeBar')[0]).left + 22;
		var max = (min - 22) + $('.volumeBar').width() - 22;
		var target = getAbsPosition($('.volumeKnob')[0]).left + 22;
		return Math.round(100*(target-min)/(max-min));
	}
})();
