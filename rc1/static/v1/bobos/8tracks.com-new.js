(function() {
  var EightTrack = window.Bobo.extend(); 

  EightTrack.prototype.initialize = function(){
    this.setInfo('priority', 2);
    this.setInfo('iconClass', 'fui-play-circle');

		this.setController( {
			url : "http://rc1.demobo.com/v1/momos/8tracks?0926"
		});
		// your custom demobo input event dispatcher
		this.setInputEventHandlers( {
			'playButton' :    'playPause',
			'pauseButton' :   'playPause',
			'nextButton' :    'next',
			'loveButton' :    'love',
			'spamButton' :    'spam',
			'volumeSlider' :  'setVolume',
			'stationItem' :   'chooseStation',
			'demoboApp' :     'onReady'
		});

		this.setupSongUpdateListener();
    if (jQuery('#player_box').css('display')==='none'){
      jQuery('#play_overlay').click();     
    }
	}

	// ********** custom event handler functions *************
  EightTrack.prototype.onReady = function(){
    this.refreshController();
  };

	EightTrack.prototype.playPause = function() {
		jQuery('#player_pause_button:visible, #player_play_button:visible').click();
	};

	EightTrack.prototype.next = function() {
		if (jQuery('#player_skip_button').css('display') === 'none'){
      jQuery('#next_mix_button').click();
    }else{
      jQuery('#player_skip_button').click(); 
    }
    this.sendNowPlaying();
	};

	EightTrack.prototype.love = function() {
    jQuery('#mix_player_details .mix_like').click();
	};

	EightTrack.prototype.spam = function() {
	};

	EightTrack.prototype.setVolume = function(num) {
		num = parseInt(num / 10) * 10;
	};

	EightTrack.prototype.sendNowPlaying = function() {
		var nowplayingdata = this.getNowPlayingData();
		if (!nowplayingdata)
			return;
		this.callFunction('loadSongInfo', nowplayingdata);
		this.callFunction('setCurrentChannel', this.getCurrentStationIndex());
	};

	EightTrack.prototype.refreshController = function() {
		this.sendStationList();
    var obj = this;
		setTimeout(function(){obj.sendNowPlaying.apply(obj, [])},100);
	};

	/* helpers */
	EightTrack.prototype.setupSongUpdateListener = function() {
		// make sure the target is an element that will not be destroyed after
		// meta
		// data updates
		var _this = {
			target : document.body,
			oldValue : jQuery('.title_artist .t').text()
		};
    var obj = this;
		_this.onChange = function() {
			var newValue = jQuery('.title_artist .t').text();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				obj.refreshController.apply(obj, []);
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, 30);
		};
		if (_this.target)
			_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
	};
	
	EightTrack.prototype.getNowPlayingData = function() {
		if (!jQuery('.title_artist .t').text())
			return null;
		var imgURL = jQuery('.cover').attr('src');
		return {
			'title' : jQuery('#now_playing .title_artist .t').text(),
			'artist' : jQuery('#now_playing .title_artist .a').text(),
			'album' : '',
			'image' : imgURL
		};
	};

	EightTrack.prototype.getStationList = function() {
		var toReturn = [];
		jQuery.each(jQuery('#sidebar .mix a img'), function(index, elem) {
			var s = {
				'title' : jQuery(elem).attr('alt')
			};
			if (index == 0)
				s.selected = true;
			toReturn.push(s);
		});
		return toReturn;
	};

	EightTrack.prototype.chooseStation = function(index) {
		index = parseInt(index);
		jQuery(jQuery('#sidebar .mix a img')[index]).click();
    setTimeout(function(){jQuery('#play_overlay').click();}, 1000);
	};

	EightTrack.prototype.getCurrentStationIndex = function() {
		var toReturn = 0;
		return toReturn;
	};

	EightTrack.prototype.sendStationList = function() {
		this.callFunction('loadChannelList', this.getStationList());
	};

  window.demoboPortal.addBobo(EightTrack);
})();
