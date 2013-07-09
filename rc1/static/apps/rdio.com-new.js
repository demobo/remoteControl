(function() {
  var Rdio = window.Bobo.extend();
	
  Rdio.prototype.initialize = function(){
    this.setInfo('priority', 2);

	  this.setInfo('ui', {
		  playPauseButton: 	'#playButton:visible, #pauseButton:visible, .footer .play_pause',
		  playButton: 		'#playButton, .footer .play_pause.playing',
		  pauseButton: 		'#pauseButton, .footer .play_pause:not(.playing)',
		  nextButton: 		'#nextButton, .footer .next',
		  previousButton: 	'#previousButton, .footer .prev',
		  likeButton: 		'',
		  dislikeButton:		'',
		  volume:				'.Slider.volume',
		  title: 				'#playerNowPlayingTitle, .footer .song_title',
		  artist: 			'#playerNowPlayingArtist, .footer .artist_title',
		  album: 				'#playerNowPlayingAlbum, .footer .album_title',
		  coverart: 			'#playerNowPlayingImage, .footer .album_icon',
		  songTrigger: 		'#player_container, .footer',
		  stationTrigger: 	'.App_MainNav_Rdio',
		  selectedStation:	'.App_MainNav_Rdio li.selected',
		  stationCollection:	'.App_MainNav_Rdio li a',
		  albumCollection:	'.InfiniteScroll:visible .Album',
		  playlistTrigger: 	''
	  };
    	
		this.setController( {
			url : 'http://rc1.demobo.com/rc/rdio?1023'
		});
		// your custom demobo input event dispatcher
		this.setInputEventHandlers( {
			'playButton' : 		  'playPause',
			'pauseButton' : 	  'playPause',
			'nextButton' : 		  'next',
			'previousButton' : 	'previous',
			'loveButton' : 		  'like',
			'spamButton' : 		  'dislike',
			'volumeSlider' : 	  'setVolume',
			'stationItem' : 	  'chooseStation',
			'playAlbum' :	    	'playAlbum',
			'demoboApp' : 		  'onReady
		});

		this.setupSongTrigger();
		this.setupStationTrigger();
	};

	// ********** custom event handler functions *************
	Rdio.prototype.onReady = function () {
		this.refreshController();
		hideDemobo();
	};

	Rdio.prototype.playPause = function () {
//		$(ui.playPauseButton).click();
		R.player.playPause();
	};

	Rdio.prototype.next = function () {
		$(this.getInfo('ui').nextButton).click();
	};

	Rdio.prototype.previous = function () {
		$(this.getInfo('ui').previousButton).click();
	};

	Rdio.prototype.like = function () {
		$(this.getInfo('ui').likeButton).click();
	};

	Rdio.prototype.dislike = function () {
		$(this.getInfo('ui').dislikeButton).click();
	};

	Rdio.prototype.setVolume = function (num) {
		num = num / 100;
		R.player.setVolume(num);
	};

	Rdio.prototype.sendNowPlaying = function () {
		var nowplayingdata = this.getNowPlayingData();
		if (!nowplayingdata)
			return;
		this.callFunction('loadSongInfo', nowplayingdata);
	};

	Rdio.prototype.refreshController = function () {
    var rdio = this;
		this.sendStationList();
		setTimeout(function(){rdio.sendNowPlaying.apply(rdio, [])},100);
	};

	Rdio.prototype.playAlbum = function (index) {
		index = parseInt(index);
		$($(this.getInfo('ui').albumCollection)[index]).mouseenter().mouseover();
		$($(this.getInfo('ui').albumCollection + ' .PlayButton')[index]).click();
	};

	/* helpers */
	Rdio.prototype.setupSongTrigger = function () {
		var triggerDelay = 50;
    var rdio = this;
		var trigger = $(this.getInfo('ui').songTrigger)[0];
		var _this = {
			oldValue : $(this.getInfo('ui').coverart).attr('src')+$(this.getInfo('ui').title).text()+$(this.getInfo('ui').artist).text()
		};
		var onChange = function() {
			var newValue = $(this.getInfo('ui').coverart).attr('src')+$(this.getInfo('ui').title).text()+$(this.getInfo('ui').artist).text();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				rdio.refreshController();
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	Rdio.prototype.setupStationTrigger = function () {
    var ui = this.getInfo('ui');
    var rdio = this;
		var triggerDelay = 50;
		var trigger = $(ui.stationTrigger)[0];
		var _this = {
			oldValue : $(ui.selectedStation).text()
		};
		var onChange = function() {
			var newValue = $(ui.selectedStation).text();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				rdio.sendStationList();
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	Rdio.prototype.getNowPlayingData = function () {
    var ui = this.getInfo('ui');
		if (!$(ui.title).text()) return null;
		var imgURL = $(ui.coverart).attr('src');
		return {
			'title' : $(ui.title).text(),
			'artist' : $(ui.artist).text(),
			'album' : $(ui.album).text(),
			'image' : imgURL
		};
	};

	Rdio.prototype.getStationList = function () {
		var toReturn = [];
		$.each($(this.getInfo('ui').stationCollection), function(index,elem) {
			var s = {
				'title' : $(elem).text().trim()
			};
			if ($(elem).parent().hasClass('selected')) s.selected = true;
			toReturn.push(s);
		});
		return toReturn;
	};

	Rdio.prototype.getAlbumCollection = function () {
		var toReturn = [];
		$.each($(this.getInfo('ui').albumCollection), function(index, elem) {
			var s = {
				album : $(elem).find('.album_title').text().trim(),
				artist: $(elem).find('.artist_title').text().trim(),
				image: 	$(elem).find('.album_image img').attr('src'),
			};
			toReturn.push(s);
		});
		return toReturn;
	};
	
	Rdio.prototype.chooseStation = function (index) {
		index = parseInt(index);
		$($(this.getInfo('ui').stationCollection)[index]).click();
	};

	Rdio.prototype.getCurrentStationIndex = function () {
		var toReturn = 0;
		$.each($(this.getInfo('ui').stationCollection), function(index,elem) {
			if ($(elem).parent().hasClass('selected')) toReturn = index;
		});
		return toReturn;
	};

	Rdio.prototype.sendStationList = function () {
		this.callFunction('loadChannelList', this.getStationList());
    var rdio = this;
		setTimeout(function(){rdio.callFunction('loadAlbumCollection', rdio.getAlbumCollection());}, 1000);
	};
	
	Rdio.prototype.getAbsPosition = function (element) {
		if (element) {
			var oLeft = 0;
			var oTop = 0;
			var o = element;
			do {
				oLeft += o.offsetLeft;
				oTop += o.offsetTop;
			} while (o = o.offsetParent);
			return {
				'left' : oLeft,
				'top' : oTop
			};
		} else {
			return {};
		}
	};

  window.demoboPortal.addBobo(Rdio);
})();
