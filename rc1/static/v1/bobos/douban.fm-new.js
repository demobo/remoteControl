(function(){
  var DEBUG=true;

  var Douban = Bobo.extend();

  Douban.prototype.initialize = function(){
    this.setInfo('iconClass', 'fui-play-circle');
    this.setInfo('priority', 2);
    this.setInfo('boboID', 'douban');
    
    this.setInfo('currentSongInfo', {});
    this.setInfo('playingState', {isPlaying:false, volume: 0});

    this.setController({
      url:'http://rc1.demobo.com/v1/momos/douban/control.html?0301'
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

    this.on('change:currentSongInfo', this.onSongChange);
    this.on('change:playingState', this.syncState);//if playingState changes, sync state
  };
	// ********** custom event handler functions *************
	Douban.prototype.playPause = function () {
    DEBUG && console.log('playPause called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		DBR.act('pause');
    this.updatePlayingState();
	}

  Douban.prototype.updatePlayingState = function(){
    //update play/pause state and volume, sync to phone if necessary
    var state = {};
    state.isPlaying = this.getIsPlaying();
    state.volume = this.getVolume(); 
    return this.setInfo('playingState', state); //will triger syncState
  }

	Douban.prototype.next = function () {
    DEBUG && console.log('next called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		DBR.act('skip');
	}

	Douban.prototype.love = function () {
    DEBUG && console.log('love called') && console.log('should be instance of Bobo: ') && console.log(this);
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		DBR.act('love');
	}

	Douban.prototype.ban = function () {
    DEBUG && console.log('ban called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		DBR.act('ban');
	}
	
	Douban.prototype.setVolume = function (num) {
    DEBUG && console.log('setVolume called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		num = parseInt(num / 10) * 10;
//		getLFMControls()._setVolume(num, true);
		//this.syncState();
	}
	
	Douban.prototype.onVolume = function (value) {
    DEBUG && console.log('onVolume called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		if (value=='up') this.setVolume(parseInt(this.getVolume())+10);
		else if (value=='down') this.setVolume(parseInt(this.getVolume())-10);
		else this.setVolume(value*100);
	}
	
	Douban.prototype.sendStationList = function () {
    DEBUG && console.log('sendStationList called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
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
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		index = parseInt(index);
		$($('.chl_name')[index]).trigger('click');
	}

	Douban.prototype.refreshController = function () {
		DEBUG && console.log('refreshController called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		this.sendStationList();
		this.sendNowPlaying();
	}

	/* helpers */
	Douban.prototype.setupSongUpdateListener = function() {
    DEBUG && console.log('setupSongUpdateListener called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
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
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		var temp = FM.getCurrentSongInfo();
		return {
			'title' : temp['songName'],
			'artist' : temp['artistName'],
			'image' : temp['coverUrl']
		};
	};

	Douban.prototype.getCurrentStationIndex = function() {
    DEBUG && console.log('getCurrentStationIndex called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		var toReturn = 0;
		var list = $.map($('.channel'), function(value, index) {
			if ($(value).hasClass('selected'))
				toReturn = index;
		});
		return toReturn;
	};

	Douban.prototype.sendNowPlaying = function() {
    DEBUG && console.log('sendNowPlaying called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		this.callFunction('loadSongInfo', this.getNowPlayingData());
		this.callFunction('setCurrentChannel', this.getCurrentStationIndex());
		//this.syncState();
	};
	
	Douban.prototype.syncState = function(oldState, curState) {
    //sync state of isPlaying and volume
    DEBUG && console.log('syncState called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
    var doubanObj = this;
		setTimeout(function() {
      console.log('this should be an instance of Douban');
      console.log(this);
			doubanObj.callFunction('syncState', curState);
		}, 30);
	};

	Douban.prototype.getIsPlaying = function () {
    DEBUG && console.log('getIsPlaying called');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		return !DBR.is_paused();
	};

	Douban.prototype.getVolume = function () {
    DEBUG && console.log('getVolume');
    DEBUG && console.log('should be instance of Bobo: ');
    DEBUG && console.log(this);
		return 50;
	};

  window.demoboPortal.addBobo(Douban);
})();
