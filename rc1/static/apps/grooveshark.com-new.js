(function() {
  /*
  This Bobo is outdated since GrooveShark has a new UI and API system. 
  TODO: accomondate the new system
  */
  var GrooveShark = window.Bobo.extend();

  GrooveShark.prototype.initialize = function(){
	  
    //this.setInfo('curState',{isPlaying: false, volume: 50});
	  this.setInfo('slideChangeTimeout', null);
	
	  this.setInfo('ui', {
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
	  });
	
		this.setController( {
			url : 'http://rc1.demobo.com/rc/grooveshark?0203'
		});
		// your custom demobo input event dispatcher
		this.setInputEventHandlers( {
			'playPauseButton' : 'playPause',
			'playButton' :      'play',
			'pauseButton' :     'pause',
			'prevButton' :      'prev',
			'nextButton' :      'next',
			'loveButton' :      'love',
			'spamButton' :      'spam',
			'volumeSlider' :    'setVolume',
			'stationItem' :     'chooseStation',
			'pinBoardItem' :    'choosePinBoard',
			'demoboVolume' :    'onVolume',
			'demoboApp' : 'refreshController'
      
		});
		this.setupSongTrigger();
		this.setupStateTrigger();
	}

	// ********** custom event handler functions *************
	GrooveShark.prototype.playPause = function () {
		GS.player.togglePlayPause();
	};
	
	GrooveShark.prototype.play = function () {
		GS.player.togglePlayPause();
	};

	GrooveShark.prototype.pause = function () {
		GS.player.togglePlayPause();
	};

	GrooveShark.prototype.prev = function () {
//		 jQuery(ui.previousButton).click();
		GS.player.previousSong();
	};

	GrooveShark.prototype.next = function () {
		// jQuery(ui.nextButton).click();
		GS.player.nextSong();
	};

	GrooveShark.prototype.love = function () {
		jQuery(this.getInfo('ui').likeButton).click();
	};

	GrooveShark.prototype.spam = function () {
		jQuery(this.getInfo('ui').dislikeButton).click();
	};

	GrooveShark.prototype.setVolume = function (num) {
		num = parseInt(num / 10) * 10;
		GS.player.setVolume(num);
		this.syncState();
	};

	GrooveShark.prototype.onVolume = function (value) {
		if (value=='up') this.setVolume(parseInt(this.getVolume())+10);
		else if (value=='down') this.setVolume(parseInt(this.getVolume())-10);
		else this.setVolume(value*100);
	};

	GrooveShark.prototype.sendNowPlaying = function () {
		this.callFunction('loadSongInfo', this.getNowPlayingData());
	};

	GrooveShark.prototype.refreshController = function () {
    var gs = this;
		this.sendStationList();
		setTimeout(function(){gs.sendNowPlaying.apply(gs, []);},100);
		this.syncState();
	};

	/* helpers */
	GrooveShark.prototype.setupSongTrigger = function () {
		var triggerDelay = 100;
		var trigger = $(this.getInfo('ui').songTrigger)[0];
    var gs = this;
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
				gs.sendNowPlaying.apply(this, []);
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, triggerDelay);
		};
		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
	};

	GrooveShark.prototype.setupStateTrigger = function () {
		$(this.getInfo('ui').volume).on('drag mouseup', syncState);
		Grooveshark.setSongStatusCallback(syncState);
	};

	GrooveShark.prototype.getNowPlayingData = function () {
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
	};

	GrooveShark.prototype.getImageURL = function (song) {
		var a = _.orEqual(a, 200);
		var b = GS.Models.Song.artPath + a + "_album.png";
		if (song.CoverArtFilename && song.CoverArtFilename.indexOf("default") == -1)
			b = GS.Models.Song.artPath + a + "_" + song.CoverArtFilename;
		return b
	};

	GrooveShark.prototype.getStationList = function () {
		var toReturn = [];
		jQuery.each(GS.Models.Station.getStationsStartMenu(),
				function(index, elem) {
					var s = {
						'title' : elem.title
					};
					toReturn.push(s);
				});
		return toReturn;
	};

	GrooveShark.prototype.getPinBoard = function () {
		var toReturn = [];
		jQuery.each(jQuery('.sidebar_link .label'), function(index, elem) {
			var s = {
				'title' : jQuery(elem).text().trim()
			};
			toReturn.push(s);
		});
		return toReturn;
	};

	GrooveShark.prototype.chooseStation = function (index) {
		if (!$.isNumeric(index)) return;
		index = parseInt(index);
		var stationName = GS.Models.Station.getStationsStartMenu()[index].title.toLowerCase();
		var stationID = GS.Models.Station.getStationByName(stationName).TagID;
		GS.player.setAutoplay(true, stationID);
		if (jQuery('.btn span[data-translate-text="POPUP_START_RADIO_TITLE"]').length)
			jQuery('.btn span[data-translate-text="POPUP_START_RADIO_TITLE"]')
					.click();
	};

	GrooveShark.prototype.choosePinBoard = function (index) {
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
	};

	GrooveShark.prototype.sendStationList = function () {
    var gs = this;
		this.callFunction('loadChannelList', this.getStationList());
		setTimeout(function(){gs.callFunction('loadPinBoard', gs.getPinBoard());},200);
	};
	
	GrooveShark.prototype.syncState = function(e) {
    var gs = this;
		setTimeout(function() {
			var curState = {isPlaying: gs.getIsPlaying(), volume: gs.getVolume()};
			gs.callFunction('syncState', curState);
		}, 30);
	};

	GrooveShark.prototype.getIsPlaying = function() {
		var playbackStatus = GS.player.getPlaybackStatus();
		return playbackStatus && playbackStatus.status == GS.player.PLAY_STATUS_PLAYING;
	};

	GrooveShark.prototype.getVolume = function() {
		return GS.player.getVolume();
	};

  window.demoboPortal.addBobo(GrooveShark);
})();
