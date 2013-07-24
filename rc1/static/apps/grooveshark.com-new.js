(function() {
  /*
  This Bobo is outdated since GrooveShark has a new UI and API system. 
  TODO: accomondate the new system
  */
  var GrooveShark = window.Bobo.extend();

  GrooveShark.prototype.initialize = function(){
	  
    //this.setInfo('curState',{isPlaying: false, volume: 50});
	  this.setInfo('slideChangeTimeout', null);
	  this.setInfo('priority', 2);
    this.setInfo('iconClass', 'fui-play-circle');

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
    if (this.getIsPlaying()){
      this.pause();
    }else{
      this.play();
    }
	};
	
	GrooveShark.prototype.play = function () {
    Grooveshark.play();
	};

	GrooveShark.prototype.pause = function () {
    Grooveshark.pause();
	};

	GrooveShark.prototype.prev = function () {
    Grooveshark.previous();
	};

	GrooveShark.prototype.next = function () {
    Grooveshark.next();
	};

	GrooveShark.prototype.love = function () {
    Grooveshark.favoriteCurrentSong();
	};

	GrooveShark.prototype.spam = function () {
	};

	GrooveShark.prototype.setVolume = function (num) {
		num = parseInt(num / 10) * 10;
    Grooveshark.setVolume(num);
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
		var trigger = $('#np-meta-container')[0];
    var gs = this;
		var _this = {
			target : trigger,
			oldValue : ''
		};
		_this.onChange = function() {
      if (!Grooveshark.getCurrentSongStatus().song) return;
			var newValue = Grooveshark.getCurrentSongStatus().song.songName;
			if (_this.oldValue !== newValue) {
				_this.oldValue = newValue;
				gs.sendNowPlaying.apply(gs, []);
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, triggerDelay);
		};
		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
	};

	GrooveShark.prototype.setupStateTrigger = function () {
		var triggerDelay = 1000;
		var trigger = $('#volume-slider')[0];
    var gs = this;
		var _this = {
			target : trigger,
			oldValue : ''
		};
		_this.onChange = function() {
			var newValue = $('#volume-slider .ui-slider-range').css('height');
			if (_this.oldValue !== newValue) {
				_this.oldValue = newValue;
				gs.syncState.apply(gs, []);
			}
		};
		_this.delay = function() {
			setTimeout(_this.onChange, triggerDelay);
		};
		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
		Grooveshark.setSongStatusCallback(function(){gs.syncState.apply(gs, [])});
	};

	GrooveShark.prototype.getNowPlayingData = function () {
		var toReturn = [];
    var o = Grooveshark.getCurrentSongStatus().song;
    if (!o){
      return;
    }
		toReturn.push( {
			'title' : o.songName,
			'artist' : o.artistName,
			'album' : o.albumName,
			'image' : o.artURL
    });
		return toReturn;
	};

	GrooveShark.prototype.getImageURL = function (song) {
		return Grooveshark.getCurrentSongStatus().song.artURL;
	};

  var oriLength=0;

	GrooveShark.prototype.getStationList = function () {
    console.log('getStationList called');
 
		var toReturn = [];
		jQuery.each(jQuery('.home-section .can-play .section-title span'),
				function(index, elem) {
					var s = {
						'title' : $(elem).text()
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
    ($('.home-section .can-play .btn.btn-large')[index]).click();
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
		return Grooveshark.getCurrentSongStatus().status==='playing';
	};

	GrooveShark.prototype.getVolume = function() {
		return Grooveshark.getVolume();
	};
  
  var tester = function(){
    if (!window.Grooveshark){
      console.log('ok');
      setTimeout(tester, 500);
    }else{
      window.demoboPortal.addBobo(GrooveShark);
      setTimeout(prepoccessing, 2000);
      console.log('passed');
    }
  };

  var prepoccessing = function(){
    return;
		$('#column1')[0].addEventListener('DOMNodeInserted', function(){$('#footer a').focus()}, false);
    $('#footer a').focus();
  };

  tester();
})();
