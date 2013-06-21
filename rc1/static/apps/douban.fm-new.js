(function(){
  var DEBUG=false;

  Douban = Bobo.extend();

  Douban.prototype.initialize = function(){
    this.getInfo('config')['iconUrl'] = 'test2.png';
    
    this.setController({
      url:'http://rc1.demobo.com/rc/douban?0301'
    });
  
    this.setInputEventHandlers({
    	'playPauseButton' : 'playPause',
			'playButton' :      'playPause',
			'pauseButton' :     'playPause',
			'loveButton' :      'love',
			'spamButton' :      'ban',
			'nextButton' :      'next',
			'channelTab' :      'sendStationList',
			'stationItem' :     'chooseStation',
			'volumeSlider' :    'setVolume',
			'demoboVolume' :    'onVolume',
      'demoboApp' :       'refreshController'  
    });
    this.setupSongUpdateListener();
  };
	// ********** custom event handler functions *************
	Douban.prototype.playPause = function () {
    DEBUG && console.log('playPause called');
		DBR.act('pause');
		this.syncState();
	}

	Douban.prototype.next = function () {
    DEBUG && console.log('next called');
		DBR.act('skip');
	}

	Douban.prototype.love = function () {
    DEBUG && console.log('love called');
		DBR.act('love');
	}

	Douban.prototype.ban = function () {
    DEBUG && console.log('ban called');
		DBR.act('ban');
	}
	
	Douban.prototype.setVolume = function (num) {
    DEBUG && console.log('setVolume called');
		num = parseInt(num / 10) * 10;
//		getLFMControls()._setVolume(num, true);
		this.syncState();
	}
	
	Douban.prototype.onVolume = function (value) {
    DEBUG && console.log('onVolume called');
		if (value=='up') this.setVolume(parseInt(this.getVolume())+10);
		else if (value=='down') this.setVolume(parseInt(this.getVolume())-10);
		else this.setVolume(value*100);
	}
	
	Douban.prototype.sendStationList = function () {
    DEBUG && console.log('sendStationList called');
		var list = $.map($('.channel'), function(value, index) {
			var s = {
				'title' : $(value).find('.chl_name').text()
			};
			if ($(value).hasClass('selected'))
				s.selected = true;
			return s;
		});
		this.callFunction('loadChannelList', list);
	}

	Douban.prototype.chooseStation = function (index) {
    DEBUG && console.log('chooseStation called');
		index = parseInt(index);
		$($('.chl_name')[index]).trigger('click');
	}

	Douban.prototype.refreshController = function () {
		DEBUG && console.log('refreshController called');
		this.sendStationList();
		this.sendNowPlaying();
	}

	/* helpers */
	Douban.prototype.setupSongUpdateListener = function() {
    DEBUG && console.log('setupSongUpdateListener called');
		// make sure the target is an element that will not be destroyed after
		// meta data updates
		var _this = {
			target : $('head title')[0],
			oldValue : document.title
		};
    var doubanObj = this;
		_this.onChange = function() {
			if (_this.oldValue !== document.title) {
				_this.oldValue = document.title;
				doubanObj.sendNowPlaying.apply(doubanObj, []);
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, 1);
		};
		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
	};

	Douban.prototype.getNowPlayingData = function() {
    DEBUG && console.log('getNowPlayingData called');
		var temp = FM.getCurrentSongInfo();
		return {
			'title' : temp['songName'],
			'artist' : temp['artistName'],
			'image' : temp['coverUrl']
		};
	};

	Douban.prototype.getCurrentStationIndex = function() {
    DEBUG && console.log('getCurrentStationIndex called');
		var toReturn = 0;
		var list = $.map($('.channel'), function(value, index) {
			if ($(value).hasClass('selected'))
				toReturn = index;
		});
		return toReturn;
	};

	Douban.prototype.sendNowPlaying = function() {
    DEBUG && console.log('sendNowPlaying called');
		this.callFunction('loadSongInfo', this.getNowPlayingData());
		this.callFunction('setCurrentChannel', this.getCurrentStationIndex());
		this.syncState();
	};
	
	Douban.prototype.syncState = function(e) {
    DEBUG && console.log('syncState called');
    var doubanObj = this;
		setTimeout(function() {
			curState = {isPlaying: doubanObj.getIsPlaying(), volume: doubanObj.getVolume()};
			doubanObj.callFunction('syncState', curState);
		}, 30);
	};

	Douban.prototype.getIsPlaying = function () {
    DEBUG && console.log('getIsPlaying called');
		return !DBR.is_paused();
	};

	Douban.prototype.getVolume = function () {
    DEBUG && console.log('getVolume');
		return 50;
	};

  window.demoboPortal.addBobo(Douban);
})();
