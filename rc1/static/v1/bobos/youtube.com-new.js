(function() {
	var main = function() {
		var Youtube = window.Bobo.extend();

		Youtube.prototype.initialize = function() {
			jQuery.noConflict();

			this.setInfo('iconClass', 'fui-play-circle');
			this.setInfo('priority', 2);
			this.setInfo('boboID', 'youtube');
			this.setInfo('name', 'Remote Control for youtube');
			this.setInfo('description', 'This is a remote control for youtube');
			this.setInfo('type', 'specific');

			this.setController({
				url : 'http://rc1.demobo.com/v1/momos/youtube/control.html?0901',
				// url : 'http://10.0.0.16:1240/v1/momos/youtube/control.html?0.56675685243',
				orientation : 'portrait'
			});

			this.setInfo('curChannel', 0);

			var ui = {
				songTrigger : '#interstitial',
				stationTrigger : '#film_strip',
				videoCollection : '.related-video .yt-thumb-clip-inner',
				playlistTrigger : '',
				searchInput : 'input[type=text].search-term',
				searchSubmit : '.search-button',
				player : null,
				playerType : null,
				isFullScreen : false
			};

			if (document.getElementById("movie_player")) {
				ui.player = document.getElementById("movie_player");
				ui.playerType = "flash";
			} else if (document.getElementsByClassName("video-stream")[0]) {
				ui.player = document.getElementsByClassName("video-stream")[0];
				ui.playerType = "html5";
			}

			this.setInfo('ui', ui);

			this.setInputEventHandlers({
				'playPauseButton' : 'playPause',
				'playButton' : 'playPause',
				'pauseButton' : 'playPause',
				'nextButton' : 'next',
				'previousButton' : 'previous',
				'rewindButton' : 'rewind',
				'fastforwardButton' : 'fastforward',
				'volumeSlider' : 'setVolume',
				'videoSliderChange' : 'setProgress',
				'playAlbum' : 'playAlbum',
				'search' : 'search',
				'searchKeyword' : 'searchKeyword',
				'reloadButton' : 'reload',
				'channelUp' : 'next',
				'channelDown' : 'previous',
				'fullScreenButton' : 'toggleScreen',
				'vimeoButton' : 'vimeoButton',
				'demoboApp' : 'onReady',
				'demoboVolume' : 'onVolume'
			});
			this.setupStateTrigger();
			this.setupVolume();
			if (localStorage.getItem('couchMode') != 'false')
				this.fullScreen();
			var y = this;
			setTimeout(function() {
				y.onReady.apply(y, []);
			}, 1000);
			setTimeout(function() {
				y.onReady.apply(y, []);
			}, 5000);

			document.addEventListener("keyup", function(event) {
				if (event.which == 27) {// esc trigger toggleScreen
					y.toggleScreen.apply(y, []);
				}
			}, true);
			ui.fullScreen = function() {
				y.fullScreen.apply(y, arguments);
			};
			ui.regularScreen = function() {
				y.regularScreen.apply(y, arguments);
			};
			ui.sendStationList = function() {
				y.sendStationList.apply(y, arguments);
			};

		};
		// ********** custom event handler functions *************
		Youtube.prototype.onReady = function() {
			this.sendStationList();
			this.sendNowPlaying();
			this.syncState();
		};

		Youtube.prototype.playPause = function() {
			var ui = this.getInfo('ui');
			if (ui.playerType == "flash") {
				if (ui.player.getPlayerState() == 1) {
					ui.player.pauseVideo();
				} else {
					ui.player.playVideo();
				}
			} else if (ui.playerType == "html5") {
				if (!ui.player.paused) {
					ui.player.pause();
				} else {
					ui.player.play();
				}
			}
		};

		Youtube.prototype.next = function() {
			this.playAlbum(0);
		};

		Youtube.prototype.previous = function() {
			history.back();
		};

		Youtube.prototype.rewind = function() {
			var ui = this.getInfo('ui');
			if (ui.playerType == "flash") {
				ui.player.seekTo(ui.player.getCurrentTime() - 5 > 0 ? ui.player.getCurrentTime() - 5 : 0, true);
			} else if (ui.playerType == "html5") {
				if (ui.player.currentTime - 5 > 0) {
					ui.player.currentTime -= 5;
				} else {
					ui.player.currentTime = 0;
				}
			}
		};

		Youtube.prototype.fastforward = function() {
			var ui = this.getInfo('ui');
			if (ui.playerType == "flash") {
				ui.player.seekTo(ui.player.getCurrentTime() + 5 < ui.player.getDuration() ? ui.player.getCurrentTime() + 5 : ui.player.getDuration(), true);
			} else if (ui.playerType == "html5") {
				if (ui.player.currentTime + 5 < ui.player.duration) {
					ui.player.currentTime += 5;
				} else {
					ui.player.currentTime = ui.player.duration;
				}
			}
		};

		Youtube.prototype.setVolume = function(num) {
			var ui = this.getInfo('ui');
			if (num >= 0)
				localStorage.setItem('demoboVolume', num);
			else
				num = localStorage.getItem('demoboVolume') || 50;
			num = Math.min(100, num);
			jQuery('#demoboVolume').show().html('<span width>VOL ' + num + ' </span>' + Array(Math.floor(parseInt(num) / 5) + 1).join("|")).stop().css('opacity', 1).fadeTo(3000, 0, function() {
				jQuery('#demoboVolume').hide();
			});
			num = num / 100;
			if (ui.playerType == "flash") {
				ui.player.setVolume(num * 100);
			} else if (ui.playerType == "html5") {
				ui.player.volume = num;
			}
		};

		Youtube.prototype.setProgress = function(num) {
			var ui = this.getInfo('ui');
			if (ui.playerType == "flash") {
				var currentTime = ui.player.getCurrentTime();
				if (num == currentTime)
					return;
				ui.player.seekTo(ui.player.getDuration() * num / 100.0);
			} else if (ui.playerType == "html5") {
				var currentTime = ui.player.currentTime;
				if (num == currentTime)
					return;
				ui.player.currentTime = ui.player.duration * num / 100.0;
			}
		};

		Youtube.prototype.getPosition = function() {
			var ui = this.getInfo('ui');
			if (ui.playerType == "flash") {
				return Math.floor((ui.player.getCurrentTime() * 1.0 / ui.player.getDuration()) * 100);
			} else if (ui.playerType == "html5") {
				return Math.floor((ui.player.currentTime * 1.0 / ui.player.duration) * 100);
			}
		};
		Youtube.prototype.getVolume = function() {
			var ui = this.getInfo('ui');
			if (ui.playerType == "flash") {
				return ui.player.getVolume();
			} else if (ui.playerType == "html5") {
				return parseInt(ui.player.volume * 100);
			}
		};
		Youtube.prototype.onVolume = function(value) {
			if (value == 'up')
				this.setVolume(parseInt(localStorage.getItem('demoboVolume')) + 5);
			else if (value == 'down')
				this.setVolume(parseInt(localStorage.getItem('demoboVolume')) - 5);
			else
				this.setVolume(value * 100);
		};

		Youtube.prototype.sendNowPlaying = function() {
			var nowplayingdata = this.getNowPlayingData();
			this.callFunction('loadSongInfo', nowplayingdata);
		};

		Youtube.prototype.playAlbum = function(index) {
			index = parseInt(index);
			if (jQuery('.video-list-item .related-video')[index]) {
				window.location = jQuery('.video-list-item .related-video')[index].href;
			} else {
				window.location = jQuery(jQuery('.context-data-item')[index]).find('a')[0].href;
			}
		};

		Youtube.prototype.search = function(keyword) {

		};

		Youtube.prototype.searchKeyword = function(keyword) {
			var ui = this.getInfo('ui');
			keyword = keyword.trim();
			if (!keyword)
				return;
			jQuery(ui.searchInput).val(keyword);
			setTimeout(function() {
				if (jQuery(ui.searchInput).val())
					jQuery('#masthead-search')[0].submit();
			}, 200);
		};

		Youtube.prototype.reload = function() {
			location.reload();
		};

		Youtube.prototype.vimeoButton = function() {
			window.location = "http://vimeo.com/couchmode";
		};
		/* helpers */
		Youtube.prototype.setupStateTrigger = function() {
			var y = this;
			if (!yt.config_.PLAYER_REFERENCE)
				return;
			yt.config_.PLAYER_REFERENCE.addEventListener("onStateChange", function(e) {
				y.syncState.apply(y, []);
				y.sendNowPlaying.apply(y, []);
			});
			setInterval(function(){
				var isPlaying = yt.config_.PLAYER_REFERENCE.getPlayerState() == 1;
				if (isPlaying) y.syncState.apply(y, []);
			}, 1000);
		};

		Youtube.prototype.setupVolume = function() {
			jQuery('body').append('<div id="demoboVolume" style="position: fixed;width: 100%;margin: auto;bottom: 10%;left: 5%; color: #00adef;font-weight: bolder; font-size: 50px;z-index: 9999999999;padding: 30px 100px;"></div>');
			this.setVolume();
		};

		Youtube.prototype.getNowPlayingData = function() {
			if (!yt.config_.PLAYER_REFERENCE)
				return {
					title : '',
					artist : '',
					image : false
				};
			var data = yt.config_.PLAYER_REFERENCE.getVideoData();
			var imgURL = "http://i1.ytimg.com/vi/" + data.video_id + "/mqdefault.jpg";
			return {
				'title' : data.title,
				'artist' : '',
				'image' : imgURL
			};
		};

		Youtube.prototype.getVideoCollection = function() {
			var relatedVideo = jQuery('.video-list-item .related-video');
			if (relatedVideo.length) {
				var toReturn = [];
				jQuery.each(relatedVideo, function(index, elem) {
					var img = jQuery(elem).find('img').attr('data-thumb') ? jQuery(elem).find('img').attr('data-thumb') : jQuery(elem).find('img').attr('src');
					var s = {
						title : jQuery(elem).find('.title').text().trim(),
						image : "http:" + img,
					};
					toReturn.push(s);
				});
			} else {
				var toReturn = [];
				jQuery.each(jQuery('.context-data-item'), function(index, elem) {
					if (!jQuery(elem).attr('data-context-item-title'))
						return;
					var img = jQuery(elem).find('img').attr('data-thumb') ? jQuery(elem).find('img').attr('data-thumb') : jQuery(elem).find('img').attr('src');
					var s = {
						title : jQuery(elem).attr('data-context-item-title').trim(),
						image : "http:" + img,
					};
					toReturn.push(s);
				});
			}
			return toReturn;
		};

		Youtube.prototype.sendStationList = function() {
			this.callFunction('loadVideoCollection', this.getVideoCollection());
		};

		Youtube.prototype.syncState = function() {
			if (!yt.config_.PLAYER_REFERENCE)
				return;
			var isPlaying = yt.config_.PLAYER_REFERENCE.getPlayerState() == 1;
			var state = {
				isPlaying : isPlaying,
				volume : this.getVolume(),
				position : this.getPosition()
			};
			this.callFunction('syncState', state);
		};

		Youtube.prototype.toggleScreen = function() {
			var ui = this.getInfo('ui');
			if (!ui.isFullScreen)
				this.fullScreen();
			else
				this.regularScreen();
		};

		Youtube.prototype.fullScreen = function() {
			var ui = this.getInfo('ui');
			if (!yt.config_.PLAYER_REFERENCE)
				return;
			jQuery('#watch7-video,#player-api, #player-api-legacy').css({
				position : 'fixed',
				top : 0,
				left : 0,
				'z-index' : 9999999998,
				width : '100%',
				height : '105%'
			});
			jQuery('#watch7-player').css({
				width : '100%',
				height : '100%'
			});
			jQuery('body').css({
				overflow : 'hidden'
			});
			ui.isFullScreen = true;
			localStorage.setItem('couchMode', 'true');
		};

		Youtube.prototype.regularScreen = function() {
			var ui = this.getInfo('ui');
			if (!yt.config_.PLAYER_REFERENCE)
				return;
			jQuery('#watch7-video,#player-api, #player-api-legacy').css({
				position : '',
				top : '',
				left : '',
				'z-index' : '',
				width : '',
				height : ''
			});
			jQuery('#watch7-player').css({
				width : '',
				height : ''
			});
			jQuery('body').css({
				overflow : ''
			});
			ui.isFullScreen = false;
			localStorage.setItem('couchMode', 'false');
		};

		window.demoboPortal.addBobo(Youtube);

	};

	var loadJS = function(src, f) {
		var script;
		script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', src);
		script.className = 'demoboJS';
		document.body.appendChild(script);
		return script.onload = f;
	};

	loadJS('//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', main);
})();
