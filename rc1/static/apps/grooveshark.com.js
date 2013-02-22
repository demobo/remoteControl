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
		name: 				'grooveshark',
		version: 			'0203',
		playPauseButton: 	'#player_play_pause',
		playButton: 		'#player_play_pause.play',
		pauseButton: 		'#player_play_pause.pause',
		nextButton: 		'#player_next',
		previousButton: 	'#player_previous',
		likeButton: 		'.queue-item.queue-item-active .smile:not(.active)',
		dislikeButton:		'.queue-item.queue-item-active .frown',
		volume:				'#volumeControl',
		title: 				'',
		artist: 			'',
		album: 				'',
		coverart:			'',
		songTrigger: 		'#queue_list',
		stationTrigger: 	'',
		selectedStation:	'',
		stationCollection:	'',
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
			'playButton' : play,
			'pauseButton' : pause,
			'prevButton' : prev,
			'nextButton' : next,
			'loveButton' : love,
			'spamButton' : spam,
			'volumeSlider' : setVolume,
			'stationItem' : chooseStation,
			'pinBoardItem' : choosePinBoard,
			'demoboVolume' : onVolume,
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
	function play() {
//		 jQuery(ui.playButton).click();
		GS.player.togglePlayPause();
	}

	function pause() {
//		 jQuery(ui.pauseButton).click();
		GS.player.togglePlayPause();
	}

	function prev() {
//		 jQuery(ui.previousButton).click();
		GS.player.previousSong();
	}

	function next() {
		// jQuery(ui.nextButton).click();
		GS.player.nextSong();
	}

	function love() {
		jQuery(ui.likeButton).click();
	}

	function spam() {
		jQuery(ui.dislikeButton).click();
	}

	function setVolume(num) {
		num = parseInt(num / 10) * 10;
		GS.player.setVolume(num);
		syncState();
	}
	function onVolume(value) {
		if (value=='up') setVolume(parseInt(getVolume())+10);
		else if (value=='down') setVolume(parseInt(getVolume())-10);
		else setVolume(value*100);
	}
	function sendNowPlaying() {
		demobo.callFunction('loadSongInfo', getNowPlayingData());
	}

	function refreshController() {
		sendStationList();
		setTimeout(sendNowPlaying,100);
		syncState();
	}

	/* helpers */
	function setupSongTrigger() {
		var triggerDelay = 100;
		var trigger = $(ui.songTrigger)[0];
		var _this = {
			target : trigger,
			oldValue : ''
		};
		_this.onChange = function() {
			var newValue = "";
			if (GS.player.activeSong)
				newValue += GS.player.activeSong.SongName;
			if (GS.player.nextSongToPlay)
				newValue += GS.player.nextSongToPlay.SongName;
			if ((GS.player.nextSongToPlay || !GS.player.autoplayEnabled) && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				sendNowPlaying();
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, triggerDelay);
		};
		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
	}
	function setupStateTrigger() {
		$(ui.volume).on('drag mouseup', syncState);
		Grooveshark.setSongStatusCallback(syncState);
	}
	function getNowPlayingData() {
		var toReturn = [];
		if (GS.player.activeSong)
			toReturn.push( {
				'title' : GS.player.activeSong.SongName,
				'artist' : GS.player.activeSong.ArtistName,
				'album' : GS.player.activeSong.AlbumName,
				'image' : getImageURL(GS.player.activeSong)
			});
		if (GS.player.nextSongToPlay)
			toReturn.push( {
				'title' : GS.player.nextSongToPlay.SongName,
				'artist' : GS.player.nextSongToPlay.ArtistName,
				'album' : GS.player.nextSongToPlay.AlbumName,
				'image' : getImageURL(GS.player.nextSongToPlay)
			});
		return toReturn;
	}

	function getImageURL(song) {
		var a = _.orEqual(a, 200);
		var b = GS.Models.Song.artPath + a + "_album.png";
		if (song.CoverArtFilename && song.CoverArtFilename.indexOf("default") == -1)
			b = GS.Models.Song.artPath + a + "_" + song.CoverArtFilename;
		return b
	}

	function getStationList() {
		var toReturn = [];
		jQuery.each(GS.Models.Station.getStationsStartMenu(),
				function(index, elem) {
					var s = {
						'title' : elem.title
					};
					toReturn.push(s);
				});
		return toReturn;
	}

	function getPinBoard() {
		var toReturn = [];
		jQuery.each(jQuery('.sidebar_link .label'), function(index, elem) {
			var s = {
				'title' : jQuery(elem).text().trim()
			};
			toReturn.push(s);
		});
		return toReturn;
	}

	function chooseStation(index) {
		if (!$.isNumeric(index)) return;
		index = parseInt(index);
		var stationName = GS.Models.Station.getStationsStartMenu()[index].title.toLowerCase();
		var stationID = GS.Models.Station.getStationByName(stationName).TagID;
		GS.player.setAutoplay(true, stationID);
		if (jQuery('.btn span[data-translate-text="POPUP_START_RADIO_TITLE"]').length)
			jQuery('.btn span[data-translate-text="POPUP_START_RADIO_TITLE"]')
					.click();
	}

	function choosePinBoard(index) {
		if (!$.isNumeric(index)) return;
		index = parseInt(index);
		var sidebarLink = jQuery(jQuery('.sidebar_link')[index]);
		if (sidebarLink.hasClass('artist')) {
			sidebarLink.contextmenu();
			setTimeout(function() {
				jQuery('.jj_menu_item_play').click();
			}, 200);
		} else if (sidebarLink.hasClass('station')) {
			sidebarLink.click();
		} else {
			// sidebarLink.hasClass('playlist') || sidebarLink.hasClass('song')
			sidebarLink.click().click();
		}
		if (jQuery('.btn span[data-translate-text="POPUP_START_RADIO_TITLE"]').length)
			jQuery('.btn span[data-translate-text="POPUP_START_RADIO_TITLE"]').click();
		setTimeout(function() {
			GS.player.setAutoplay(true);
		}, 2000);
	}

	function sendStationList() {
		demobo.callFunction('loadChannelList', getStationList());
		setTimeout(function(){demobo.callFunction('loadPinBoard', getPinBoard());},200);
	}
	
	function syncState(e) {
		setTimeout(function() {
			curState = {isPlaying: getIsPlaying(), volume: getVolume()};
			demobo.callFunction('syncState', curState);
		}, 30);
	}
	function getIsPlaying() {
		var playbackStatus = GS.player.getPlaybackStatus();
		return playbackStatus && playbackStatus.status == GS.player.PLAY_STATUS_PLAYING;
	}
	function getVolume() {
		return GS.player.getVolume();
	}
})();