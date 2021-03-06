(function() {
	var DEBUG = false;

	var VideoSandbox = Bobo.extend();

	VideoSandbox.prototype.initialize = function() {
		this.setInfo('iconClass', 'fui-play-circle');
		this.setInfo('priority', 3);
		this.setInfo('boboID', 'videosandbox');
		this.setInfo('name', 'Sandbox Video Bobo');
		this.setInfo('description', 'A sandbox bobo that is only supposed to work on demobo.com');
		this.setInfo('type', 'specific');

		this.setController({
			url : 'http://rc1.demobo.com/v1/momos/videoplayer/control.html?0801'
		});

		this.setInputEventHandlers({
			'playPauseButton' : 'playPause',
			'volumeSliderChange' : 'setVolume',
			'videoSliderChange' : 'setProgress',
			'demoboApp' : 'refreshController'
		});
	};
	// ********** custom event handler functions *************
	VideoSandbox.prototype.setProgress = function(num) {
		if (num==$('video')[0].currentTime) return;
		$('video')[0].currentTime = $('video')[0].duration * num / 100.0
	};

	VideoSandbox.prototype.run = function() {
    window.demobo.addEventListener('connected', function(){
      window.demoboPortal.switchBobo('videosandbox');
    });
		var jv = $('video');
		var vs = this;
		jv.bind('timeupdate', function() {
			vs.syncState.apply(vs, []);
		});
		jv.bind('volumechange', function() {
			vs.syncState.apply(vs, []);
		});
	};

	VideoSandbox.prototype.playPause = function() {
		DEBUG && console.log('playPause called');
		if ($('video')[0].paused) {
			$('video')[0].play();
		} else {
			$('video')[0].pause();
		}
		this.syncState();
	};

	VideoSandbox.prototype.syncState = function() {
		var v = $('video')[0];
		var state = {
			isPlaying : !v.paused,
			volume : Math.floor(v.volume * 100),
			position : Math.floor((v.currentTime * 1.0 / v.duration) * 100)
		};
		this.callFunction('syncState', state);
	};

	VideoSandbox.prototype.setVolume = function(num) {
		if (num==$('video')[0].volume) return;
		DEBUG && console.log('setVolume called');
		$('video')[0].volume = num * 1.0 / 100;
	};

	VideoSandbox.prototype.refreshController = function() {
		DEBUG && console.log('refreshController called');
		this.resumeBobo();
	};

	VideoSandbox.prototype.resumeBobo = function() {
		console.log('videosandbox\'s resume is clicked');
		$('.flex-control-nav li a')[1].click();
	};

	window.demoboPortal.addBobo(VideoSandbox);
})();
