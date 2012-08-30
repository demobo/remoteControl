function setDemoboController() {
	demobo.setController( {
		url : "http://rc1.demobo.com/rc/grooveshark?0830"
	});
}

// do all the iniations you need here
function demoboInitiation() {
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
		if (_this.oldValue !== newValue) {
			_this.oldValue = newValue;
			sendNowPlaying();
		}
	};
	_this.delay = function() {
		setTimeout(_this.onChange, 30);
	};
	_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
}

// your custom demoboApp event dispatcher
demoboInputDispatcher.addCommands( {
	'playButton' : play,
	'pauseButton' : pause,
	'nextButton' : next,
	'loveButton' : love,
	'spamButton' : spam,
	'volumeSlider' : setVolume,
	'stationItem' : chooseStation,
	'pinBoardItem' : choosePinBoard,
	'nowPlayingTab' : refreshController,
	'demoboApp' : function() {
		refreshController();
		hideDemobo();
	}
});

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
	sendNowPlaying();
}

/* helpers */
function getNowPlayingData() {
	var toReturn = [];
	if (GS.player.activeSong)
		toReturn.push( {
			'title' : GS.player.activeSong.SongName,
			'artist' : GS.player.activeSong.ArtistName,
			'album' : GS.player.activeSong.AlbumName,
			'image' : GS.player.activeSong.getImageURL()
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
	var a = _.orEqual(a, 70);
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
	if (sidebarLink.hasClass('artist') || sidebarLink.hasClass('playlist')) {
		sidebarLink.contextmenu();
		setTimeout(function() {
			jQuery('.jj_menu_item_play').click();
		}, 100);
	} else {
		sidebarLink.click();
	}
	if (jQuery('.btn span[data-translate-text="POPUP_START_RADIO_TITLE"]').length)
		jQuery('.btn span[data-translate-text="POPUP_START_RADIO_TITLE"]').click();
	setTimeout(function() {
		GS.player.setAutoplay(true);
	}, 2000);
}

function sendStationList() {
	demobo.callFunction('loadChannelList', getStationList());
	demobo.callFunction('loadPinBoard', getPinBoard());
}

function setDevice(data) {
	if (data) {
		console.log(data);
		hideDemobo();
	}
}

// dont modify the codes below if you dont know what you are doing
(function() {
	if (DEMOBO) {
		DEMOBO.developer = 'developer@demobo.com';
		DEMOBO.maxPlayers = 1;
		DEMOBO.stayOnBlur = true;
		DEMOBO.init = function() {
			setDemoboController();
			demobo.addEventListener('input', function(e) {
				console.log(e);
				demoboInputDispatcher.execCommand(e.source, e.value);
			});
			demobo.addEventListener('connected', function(e) {
				console.log('connected');
			});
			showDemobo();
			demobo.getDeviceInfo('', 'setDevice');
		}
		demobo.start();
	}
	demoboInitiation();
	demoboLoading = undefined;
})();