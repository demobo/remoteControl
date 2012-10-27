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
		name: 				'rdio',
		version: 			'1023',
		playPauseButton: 	'#playButton:visible, #pauseButton:visible, .footer .play_pause',
		playButton: 		'#playButton, .footer .play_pause.playing',
		pauseButton: 		'#pauseButton, .footer .play_pause:not(.playing)',
		nextButton: 		'#nextButton, .footer .next',
		previousButton: 	'#previousButton, .footer .prev',
		likeButton: 		'',
		dislikeButton:		'',
		volume:				'.Slider.volume',
		title: 				'#playerNowPlayingTitle, .footer .song_title',
		artist: 			'#playerNowPlayingArtist, .footer .artist_title',
		album: 				'#playerNowPlayingAlbum, .footer .album_title',
		coverart: 			'#playerNowPlayingImage, .footer .album_icon',
		songTrigger: 		'#player_container, .footer',
		stationTrigger: 	'.App_MainNav_Rdio',
		selectedStation:	'.App_MainNav_Rdio li.selected',
		stationCollection:	'.App_MainNav_Rdio li a',
		albumCollection:	'.InfiniteScroll:visible .Album',
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
			'playButton' : 		playPause,
			'pauseButton' : 	playPause,
			'nextButton' : 		next,
			'previousButton' : 	previous,
			'loveButton' : 		like,
			'spamButton' : 		dislike,
			'volumeSlider' : 	setVolume,
			'stationItem' : 	chooseStation,
			'playAlbum' :		playAlbum,
			'demoboApp' : 		onReady
		});
		showDemobo();
		setupSongTrigger();
		setupStationTrigger();
	}

	// ********** custom event handler functions *************
	function onReady() {
		refreshController();
		hideDemobo();
	}
	function playPause() {
//		$(ui.playPauseButton).click();
		R.player.playPause();
	}
	function next() {
		$(ui.nextButton).click();
	}
	function previous() {
		$(ui.previousButton).click();
	}
	function like() {
		$(ui.likeButton).click();
	}
	function dislike() {
		$(ui.dislikeButton).click();
	}
	function setVolume(num) {
		num = num / 100;
		R.player.setVolume(num);
	}
	function sendNowPlaying() {
		var nowplayingdata = getNowPlayingData();
		if (!nowplayingdata)
			return;
		demobo.callFunction('loadSongInfo', nowplayingdata);
	}
	function refreshController() {
		sendStationList();
		setTimeout(sendNowPlaying,100);
	}
	function playAlbum(index) {
		index = parseInt(index);
		$($(ui.albumCollection)[index]).mouseenter().mouseover();
		$($(ui.albumCollection + ' .PlayButton')[index]).click();
	}

	/* helpers */
	function setupSongTrigger() {
		var triggerDelay = 50;
		var trigger = $(ui.songTrigger)[0];
		var _this = {
			oldValue : $(ui.coverart).attr('src')+$(ui.title).text()+$(ui.artist).text()
		};
		var onChange = function() {
			var newValue = $(ui.coverart).attr('src')+$(ui.title).text()+$(ui.artist).text();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				refreshController();
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
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
	function getNowPlayingData() {
		if (!$(ui.title).text()) return null;
		var imgURL = $(ui.coverart).attr('src');
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

	function getAlbumCollection() {
		var toReturn = [];
		$.each($(ui.albumCollection), function(index, elem) {
			var s = {
				album : $(elem).find('.album_title').text().trim(),
				artist: $(elem).find('.artist_title').text().trim(),
				image: 	$(elem).find('.album_image img').attr('src'),
			};
			toReturn.push(s);
		});
		return toReturn;
	}
	
	function chooseStation(index) {
		index = parseInt(index);
		$($(ui.stationCollection)[index]).click();
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
		setTimeout(function(){demobo.callFunction('loadAlbumCollection', getAlbumCollection());}, 1000);
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

})();