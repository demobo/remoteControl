(function() {
	var DEBUG = false;

	var Npr = Bobo.extend();

	Npr.prototype.initialize = function() {
		this.setInfo('priority', 2);
		this.setInfo('boboID', 'npr');
		this.setInfo('name', 'Remote Control for npr');
		this.setInfo('description', 'This is a remote control for npr');
		this.setInfo('type', 'specific');

		//overwrites the 'setInputEventHandlers'
		this.setInputEventHandlers = function(inputEventHandlers) {
			var eventName, handlerName, hs, wrapper, _thisBobo;

			_thisBobo = this;
			wrapper = function(bobo, functionName) {
				return function() {
					//check if an Eventlistener is existed on the jPlayer, if not, add one.
					bobo.addJplayerListener();
					bobo.addNewsTitleListener();
					return bobo[functionName].apply(bobo, arguments);
				};
			};
			hs = {};
			for (eventName in inputEventHandlers) {
				handlerName = inputEventHandlers[eventName];
				hs[eventName] = wrapper(_thisBobo, handlerName);
			}
			this.setInfo('inputEventHandlers', hs);
			return true;
		};

		this.getInfo('config')['iconUrl'] = 'test2.png';
		this.setInfo('iconClass', 'fui-play-circle');

		this.setController({
			url : 'http://rc1.demobo.com/v1/momos/npr/control.html?1'
		});

		this.setInputEventHandlers({
			'playPauseButton' : 'playPause',
			'playButton' : 'play',
			'pauseButton' : 'pause',
			'nextButton' : 'next',
			'previousButton' : 'back',
			'loveButton' : 'like',
			'spamButton' : 'dislike',
			'volumeSlider' : 'setVolume',
			'stationItem' : 'chooseStation',
			'demoboVolume' : 'onVolume',
			'demoboApp' : 'onReady',
		});

		this.setInfo('last3PlayedSongs', []);
		this.setInfo('curState', {
			isPlaying : false,
			volume : 50
		});
		this.setInfo('slideChangeTimeout', null);
		this.setInfo('ui', {
			playPauseButton : '.sprite-play:visible, .sprite-pause:visible',
			playButton : '.sprite-play',
			pauseButton : '.sprite-pause',
			nextButton : '.sprite-next',
			previousButton : '.sprite-back',
			likeButton : '.thumbUpButton',
			dislikeButton : '.thumbDownButton',
			volume : '.jp-volume-bar-value',
			title : '.playerBarSong',
			artist : '.playerBarArtist',
			album : '.playerBarAlbum',
			coverart : '.stationSlides:visible .art[src], .playerBarArt',
			songTrigger : '#playerBar .nowplaying',
			stationTrigger : '.middlecolumn',
			selectedStation : '.stationChangeSelector .textWithArrow, .stationChangeSelectorNoMenu p',
			stationCollection : '.channel-dropdown .channel',
			albumCollection : '',
			playlistTrigger : '',
		});
		this.setupSongTrigger();
		this.setupStationTrigger();
		this.setupStateTrigger();
	};

	Npr.prototype.addJplayerListener = function() {
		//bind volumechange event to jPlayer
		var jp = $("#ip_player1");
		var flag = false;
		var thisBobo = this;
		if (jp) {
			if (jp.data('events') && jp.data('events')["jPlayer_volumechange"]) {
				for (var i in jp.data('events')["jPlayer_volumechange"]) {
					if (jp.data('events')["jPlayer_volumechange"][i].handler == thisBobo.onVolume_jPlayer) {
						flag = true;
					}
				}
			}
			if (!flag) {
				console.log('addjPlayerEventListener');
				jp.bind($.jPlayer.event.volumechange, thisBobo, thisBobo.onVolume_jPlayer);
			}
		}
	}

	Npr.prototype.addNewsTitleListener = function() {
		//bing DOMchange event to news title
		var news = $('.span8.story-content h1');
		var flag = false;
		var thisBobo = this;
		if (news) {
			if (news.data('events') && news.data('events')["DOMSubtreeModified"]) {
				for (var i in news.data('events')["DOMSubtreeModified"]) {
					if (news.data('events')["DOMSubtreeModified"][i].handler == thisBobo.onNewsChange) {
						flag = true;
					}
				}
			}
			if (!flag) {
				console.log('addNewsChangeEventListener');
				news.bind("DOMSubtreeModified", thisBobo, thisBobo.onNewsChange);
			}
		}
	}

	Npr.prototype.resume = function() {
		console.log('resume is called');
	};
	// ********** custom event handler functions *************
	Npr.prototype.onReady = function() {
		console.log('onReady called');
		this.refreshController();
		this.sendStationList();
		this.sendNowPlaying();
		//    this.sendLast3();
		this.syncState();
		this.syncStory();
	};

	Npr.prototype.playPause = function() {
		console.log('playpause called');
		$(this.getInfo('ui').playPauseButton).click();
	};

	Npr.prototype.play = function() {
		console.log('play called')
		$(this.getInfo('ui').playButton).click();
	};

	Npr.prototype.pause = function() {
		$(this.getInfo('ui').pauseButton).click();
	};

	Npr.prototype.next = function() {
		console.log('next pressed');
		$(this.getInfo('ui').nextButton).click();
	};

	Npr.prototype.back = function() {
		console.log('back pressed');
		$(this.getInfo('ui').nextButton).click();
	};

	Npr.prototype.like = function() {
		$(this.getInfo('ui').likeButton).click();
	};

	Npr.prototype.dislike = function() {
		$(this.getInfo('ui').dislikeButton).click();
	};

	Npr.prototype.setVolume = function(num, evt) {
		num = parseInt(num);
		if (num == this.getVolume())
			return;
		$("#ip_player1").jPlayer("volume", num / 100);
	};

	Npr.prototype.onVolume = function(value) {
		if (value == 'up')
			this.setVolume(parseInt(this.getVolume()) + 5);
		else if (value == 'down')
			this.setVolume(parseInt(this.getVolume()) - 5);
		else
			this.setVolume(value * 100);
	};

	Npr.prototype.onVolume_jPlayer = function(evt) {
		var thisBobo = evt.data;
		console.log('jpVolume: ' + evt.jPlayer.options.volume);
		thisBobo.syncState();
	};

	Npr.prototype.onNewsChange = function(evt) {
		var thisBobo = evt.data;
		console.log('newsChange: ' + evt.srcElement.data);
		thisBobo.syncStory(evt);
	}

	Npr.prototype.chooseStation = function(index) {
		index = parseInt(index);
		$(this.getInfo('ui').stationCollection)[index].click();
	};

	Npr.prototype.refreshController = function() {
		console.log('refreshController called');
		this.sendStationList();
		var _this = this
		setTimeout(function() {
			_this.sendLast3()
		}, 100);
		this.syncState();
	};

	//helpers
	Npr.prototype.setupSongTrigger = function() {
		console.log('setupsongtrigger called');
		var triggerDelay = 50;
		var longDelay = 500;
		var trigger = $(this.getInfo('ui').songTrigger)[0];
		var _this = {
			oldCoverart : $(this.getInfo('ui').coverart).attr('src'),
			oldTitle : $(this.getInfo('ui').title).text()
		};
		var maxChecks = 10;
		var nprObj = this;
		var checkTitle = function() {
			var newTitle = $(nprObj.getInfo('ui').title).text();
			if (newTitle && _this.oldTitle !== newTitle) {
				_this.oldTitle = newTitle;
				checkCoverart(maxChecks);
			}
		};
		var checkCoverart = function(checksLeft) {
			var newCoverart = $(nprObj.getInfo('ui').coverart).attr('src');
			if (newCoverart && _this.oldCoverart !== newCoverart) {
				_this.oldCoverart = newCoverart;
				nprObj.sendNowPlaying();
			} else if (checksLeft) {
				setTimeout(function() {
					checkCoverart(checksLeft - 1);
				}, longDelay);
			} else {
				var newCoverart = $(nprObj.getInfo('ui').coverart).attr('src');
				_this.oldCoverart = newCoverart;
				nprObj.sendNowPlaying();
			}
		}
		var delay = function() {
			setTimeout(checkTitle, triggerDelay);
		};
		if (trigger)
			trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	Npr.prototype.setupStationTrigger = function() {
		console.log('setupStationTrigger called');
		var triggerDelay = 50;
		var trigger = $(this.getInfo('ui').stationTrigger)[0];
		var _this = {
			oldValue : $(this.getInfo('ui').selectedStation).text()
		};
		var nprObj = this;
		var onChange = function() {
			var newValue = $(nprObj.getInfo('ui').selectedStation).text();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				nprObj.sendStationList();
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger)
			trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	Npr.prototype.setupStateTrigger = function() {
		console.log('setupStateTrigger called');
		var _this = this;
		$(this.getInfo('ui').volume).on('drag click', function() {
			_this.syncState()
		});
		$(this.getInfo('ui').playButton + ',' + this.getInfo('ui').pauseButton).on('click', function() {
			_this.syncState()
		});
		$(this.getInfo('ui').nextButton + ',' + this.getInfo('ui').previousButton).on('click', function() {
			_this.syncState()
		});
	};

	Npr.prototype.getAbsPosition = function(element) {
		console.log('getAbsPosition called');
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

	Npr.prototype.getNowPlayingData = function() {
		console.log('getNowPlayingData called');
		return this.getInfo('last3PlayedSongs');
	};

	Npr.prototype.getCurrentSong = function() {
		console.log('getCurrentSong called');
		var imgURL = $(this.getInfo('ui').coverart).attr('src');
		if (!imgURL)
			return;
		if (imgURL.substr(0, 4) != 'http')
			imgURL = "http://www.pandora.com/img/no_album_art.jpg";
		//document.location.origin + imgURL;
		return {
			'title' : $(this.getInfo('ui').title).text(),
			'artist' : $(this.getInfo('ui').artist).text(),
			'album' : $(this.getInfo('ui').album).text(),
			'image' : imgURL
		};
	};

	Npr.prototype.getStationList = function() {
		console.log('getStationList called');
		var toReturn = [];
		$.each($(this.getInfo('ui').stationCollection), function(index, elem) {
			var elemObj = $(elem);
			var s = {
				'title' : $('h3', elemObj).text().trim(),
				'subtitle' : $('p', elemObj).text().trim(),
			};
			if ($(elem).parent().hasClass('selected'))
				s.selected = true;
			toReturn.push(s);
		});
		console.log(toReturn);
		return toReturn;
	};

	Npr.prototype.getCurrentStationIndex = function() {
		console.log('getCurrentStationIndex called');
		var toReturn = 0;
		$.each($(this.getInfo('ui').stationCollection), function(index, elem) {
			if ($(elem).parent().hasClass('selected'))
				toReturn = index;
		});
		return toReturn;
	};

	Npr.prototype.sendStationList = function() {
		console.log('sendStationList called');
		this.callFunction('loadChannelList', this.getStationList());
	};

	Npr.prototype.sendNowPlaying = function() {
		console.log('sendNowPlaying called');
		var curSong = this.getCurrentSong();
		if (!curSong)
			return;
		if (!this.getInfo('last3PlayedSongs').length || this.getInfo('last3PlayedSongs')[this.getInfo('last3PlayedSongs').length - 1].title != curSong.title) {
			this.getInfo('last3PlayedSongs').push(curSong);
			while (this.getInfo('last3PlayedSongs').length > 3) {
				this.getInfo('last3PlayedSongs').shift();
			}
		} else if (this.getInfo('last3PlayedSongs')[this.getInfo('last3PlayedSongs').length - 1].title == curSong.title) {
			this.getInfo('last3PlayedSongs')[this.getInfo('last3PlayedSongs').length - 1] = curSong;
		}
		this.callFunction('loadSongInfo', curSong);
		this.syncState();
	};

	Npr.prototype.sendLast3 = function() {
		console.log('sendLast3 called');
		if (this.getInfo('last3PlayedSongs').length)
			var curSong = this.getInfo('last3PlayedSongs');
		else {
			var curSong = this.getCurrentSong();
			if (!curSong)
				return;
			this.getInfo('last3PlayedSongs').push(curSong);
		}
		this.callFunction('loadSongInfo', curSong);
	};

	Npr.prototype.syncState = function(e) {
		var npr = this;
		setTimeout(function() {
			npr.setInfo('curState', {
				isPlaying : npr.getIsPlaying(),
				volume : npr.getVolume()
			});
			npr.callFunction('syncState', npr.getInfo('curState'));
		}, 30);
	};

	Npr.prototype.syncStory = function(evt) {
		var npr = this;
		setTimeout(function() {
			npr.setInfo('curStory', {
				curStory : $('.story-content .title').text(),
				curSlug : $('.slug').text(),
				curSubtitle : $('.story-content span').text(),
			});
			npr.callFunction('syncStory', npr.getInfo('curStory'));
		}, 30);
	};

	Npr.prototype.getIsPlaying = function() {
		console.log('getIsPlaying called');
		return !$(this.getInfo('ui').playButton + ':visible').length;
	};
	Npr.prototype.getVolume = function() {
		console.log('getVolume called');
		return $("#ip_player1").data("jPlayer").options.volume * 100;
	};

	window.demoboPortal.addBobo(Npr);

})();
