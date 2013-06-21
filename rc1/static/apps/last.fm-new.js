(function(){
  Lastfm = window.Bobo.extend();
  
  Lastfm.prototype.initialize = function(){
    this.getInfo('config')['iconUrl'] = 'test2.png';

    this.setController({
      url: 'http://rc1.demobo.com/rc/lastfm?0201'      
    });

    this.setInputEventHandlers({
      'playPauseButton' : 'playPause',
			'playButton' :      'playPause',
			'pauseButton' :     'playPause',
			'nextButton' :      'next',
			'loveButton' :      'love',
			'spamButton' :      'spam',
			'volumeSlider' :    'setVolume',
			'stationItem' :     'chooseStation',
			'demoboVolume' :    'onVolume',
      'demoboApp' :       'onReady' 
    });

    this.setInfo('curState', {isPlaying: false, volume: 50});
    this.setInfo('slideChangeTimeout', null);
    this.setInfo('ui', {
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

    });


    this.setupSongTrigger();
    this.setupStateTrigger();
  };

	// ********** custom event handler functions *************
  Lastfm.prototype.onReady = function(){
    this.refreshController();
  };

	Lastfm.prototype.playPause = function() {
    var ui = this.getInfo('ui');
		jQuery(ui.playPauseButton).click();
	};

	Lastfm.prototype.next = function() {
    var ui = this.getInfo('ui');
		jQuery(ui.nextButton).click();
	};

	Lastfm.prototype.love = function() {
    var ui = this.getInfo('ui');
		jQuery(ui.likeButton).click();
	};

	Lastfm.prototype.spam = function() {
    var ui = this.getInfo('ui');
		jQuery(ui.dislikeButton).click();
	};

	Lastfm.prototype.setVolume = function(num) {
		num = parseInt(num / 10) * 10;
		this.getLFMControls()._setVolume(num, true);
		this.syncState();
	};

	Lastfm.prototype.onVolume = function(value) {
		if (value=='up') this.setVolume(parseInt(this.getVolume())+10);
		else if (value=='down') this.setVolume(parseInt(this.getVolume())-10);
		else this.setVolume(value*100);
	};

	Lastfm.prototype.sendNowPlaying = function() {
		var nowplayingdata = this.getNowPlayingData();
		if (!nowplayingdata)
			return;
		this.callFunction('loadSongInfo', this.nowplayingdata);
		this.callFunction('setCurrentChannel', this.getCurrentStationIndex());
	};

	Lastfm.prototype.refreshController = function() {
		this.sendStationList();
    var lastfm = this;
		setTimeout(function(){lastfm.sendNowPlaying.apply(lastfm, []);},100);
		this.syncState();
	};

	/* helpers */
	Lastfm.prototype.setupSongTrigger = function () {
    var ui = this.getInfo('ui');
		var triggerDelay = 30;
		var trigger = jQuery(ui.songTrigger)[0];
		var _this = {
			target : trigger,
			oldValue : jQuery('#nowPlayingMeta img').attr('src')
		};

    var lastfm = this;

		_this.onChange = function() {
			var newValue = jQuery('#nowPlayingMeta img').attr('src');
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				lastfm.refreshController.apply(lastfm, []);
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, triggerDelay);
		};
		if (_this.target)
			_this.target.addEventListener('DOMSubtreeModified', _this.delay,
					false);
	};

	Lastfm.prototype.setupStateTrigger = function() {
    var ui = this.getInfo('ui');
    var lastfm = this;
		jQuery(ui.volume).on('drag mouseup', function(){lastfm.syncState.apply(lastfm, [])});
		jQuery(document).on('click', ui.playPauseButton, function(){lastfm.syncState.apply(lastfm, [])});
	};

	Lastfm.prototype.getNowPlayingData = function() {
    var ui = this.getInfo('ui');
		if (!jQuery(ui.title).text())
			return null;
		var imgURL = jQuery(ui.coverart).attr('src');
		return {
			'title' : jQuery(ui.title).text(),
			'artist' : jQuery(ui.artist).text(),
			'album' : jQuery(ui.album).text(),
			'image' : imgURL.replace('64s', '174s')
		};
	};

	Lastfm.prototype.getStationList = function() {
    var ui = this.getInfo('ui');
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
	};

	Lastfm.prototype.chooseStation = function(index) {
    var ui = this.getInfo('ui');
		index = parseInt(index);
		jQuery(jQuery(ui.stationCollection + ' a span')[index]).click();
	};

	Lastfm.prototype.getCurrentStationIndex = function() {
		var toReturn = 0;
		return toReturn;
	};

	Lastfm.prototype.sendStationList = function() {
		this..callFunction('loadChannelList', this.getStationList());
	};

	Lastfm.prototype.getLFMControls = function() {
		return LFM.Flash.Player.observers[0].controls;
	};

	Lastfm.prototype.getLFMPlayer = function() {
		return LFM.Flash.Player.observers[0].player;
	};
	
	Lastfm.prototype.syncState = function(e) {
    var lasfm = this;
		setTimeout(function() {
			curState = {isPlaying: lastfm.getIsPlaying(), volume: lastfm.getVolume()};
			lastfm.callFunction('syncState', curState);
		}, 30);
	};

	Lastfm.prototype.getIsPlaying = function() {
		var controls = this.getLFMControls();
		return controls && controls.observers[0].state == 'playing';
	};

	Lastfm.prototype.getVolume = function() {
		return parseInt(this.getLFMControls().volume);
	};

  window.demoboPorta.addBobo(Lastfm);
})();
