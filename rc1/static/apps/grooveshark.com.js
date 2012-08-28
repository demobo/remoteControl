function setDemoboController() {
	demobo.setController( {
		url : "http://rc1.demobo.com/rc/grooveshark"
	});
}

// do all the iniations you need here
function demoboInitiation() {
	// make sure the target is an element that will not be destroyed after meta
	// data updates
	var _this = {
		target : jQuery('#playerDetails_nowPlaying')[0],
		oldValue : jQuery('.queue-item.queue-item-active .albumart img').attr('src')
	};
	_this.onChange = function() {
		var newValue = jQuery('.queue-item.queue-item-active .albumart img').attr('src');
		if (newValue && _this.oldValue !== newValue) {
			_this.oldValue = newValue;
			refreshController();
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
	'nowPlayingTab' : refreshController,
	'demoboApp' : function() {
		refreshController();
		hideDemobo();
	}
});

// ********** custom event handler functions *************
function play() {
	jQuery('#player_play_pause.play').click();
}

function pause() {
	jQuery('#player_play_pause.pause').click();
}

function prev() {
	jQuery('#player_previous').click();
}

function next() {
	jQuery('#player_next').click();
}

function love() {
	jQuery('.queue-item.queue-item-active .smile').click();
}

function spam() {
	jQuery('.queue-item.queue-item-active .frown').click();
}

function setVolume(num) {
	num = parseInt(num / 10) * 10;
	GS.player.setVolume(num);
}

function sendNowPlaying() {
	demobo.callFunction('loadSongInfo', getNowPlayingData());
	demobo.callFunction('setCurrentChannel', getCurrentStationIndex());
}

function refreshController() {
	console.log('refresh');
	sendStationList();
	sendNowPlaying();
}

/* helpers */
function getNowPlayingData() {
	return {
		'title' : GS.player.activeSong.SongName,
		'artist' : GS.player.activeSong.ArtistName,
		'album' : GS.player.activeSong.AlbumName,
		'image' : jQuery('.queue-item.queue-item-active img').attr('src')
	};
}

function getStationList() {
	var toReturn = [];
	jQuery('#player_radio_label').click();
	jQuery.each(jQuery('#jjmenu_main .jj_menu_item_station .jj_menu_item_text'), function(index, elem) {
		var s = {
			'title' : jQuery(elem).text().trim()
		};
		if (index == 0)
			s.selected = true;
		toReturn.push(s);
	});
	jQuery('#player_radio_label').click();
	jQuery.each(jQuery('#jjmenu_main .jj_menu_item_station .jj_menu_item_text'), function(index, elem) {
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
	jQuery('#player_radio_label').click();
	jQuery(jQuery('#recentStationsList li a span')[index]).click();
	jQuery('.btn span[data-translate-text="POPUP_START_RADIO_TITLE"]').click();
}

function getCurrentStationIndex() {
	var toReturn = 0;
	return toReturn;
}

function sendStationList() {
	demobo.callFunction('loadChannelList', getStationList());
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