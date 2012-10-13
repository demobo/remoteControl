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
			url : "http://rc1.demobo.com/rc/grooveshark?0927"
		});
		// your custom demobo input event dispatcher
		demobo.inputEventDispatcher.addCommands( {
			'playButton' : play,
			'pauseButton' : pause,
			'nextButton' : next,
			'loveButton' : love,
			'spamButton' : spam,
			'volumeSlider' : setVolume,
			'stationItem' : chooseStation,
			'pinBoardItem' : choosePinBoard,
			'demoboApp' : function() {
				refreshController();
				hideDemobo();
			}
		});
		showDemobo();
		setupSongUpdateListener();
	}

	// ********** custom event handler functions *************
	function play() {
		// jQuery('#player_play_pause.play').click();
		GS.player.togglePlayPause();
	}

	function pause() {
		// jQuery('#player_play_pause.pause').click();
		GS.player.togglePlayPause();
	}

	function prev() {
		// jQuery('#player_previous').click();
		player.previousSong();
	}

	function next() {
		// jQuery('#player_next').click();
		GS.player.nextSong();
	}

	function love() {
		jQuery('.queue-item.queue-item-active .smile:not(.active)').click();
	}

	function spam() {
		jQuery('.queue-item.queue-item-active .frown').click();
	}

	function setVolume(num) {
		num = parseInt(num / 10) * 10;
		GS.player.setVolume(num);
	}

	function sendNowPlaying() {
		console.log('sendNowPlaying');
		demobo.callFunction('loadSongInfo', getNowPlayingData());
	}

	function refreshController() {
		console.log('refresh');
		sendStationList();
		setTimeout(sendNowPlaying,100);
	}

	/* helpers */
	function setupSongUpdateListener() {
		// make sure the target is an element that will not be destroyed after meta
		// data updates
		var _this = {
			target : jQuery('#queue_list')[0],
			oldValue : ''
		};
		_this.onChange = function() {
			console.log('onChange send now playing');
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
			setTimeout(_this.onChange, 100);
		};
		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
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
})();