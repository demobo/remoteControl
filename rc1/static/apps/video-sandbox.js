(function(){
  var DEBUG=false;

  var VideoSandbox = Bobo.extend();

  VideoSandbox.prototype.initialize = function(){
    this.setInfo('iconClass', 'fui-play-circle');
    this.setInfo('priority', 3);

    this.setController({
      url:'http://10.0.0.14:1240/v1/momos/videoplayer/control.html?0301'
    });
  
    this.setInputEventHandlers({
			'playPauseButton' :      'playPause',
			'volumeSlider' :    'setVolume',
      'videoSlider' : 'setProgress',
      'demoboApp' :       'refreshController'  
    });

    this.setup();
    
  };
	// ********** custom event handler functions *************
  VideoSandbox.prototype.setProgress = function(num){
    $('video')[0].currentTime = $('video')[0].duration * num /100.0
  };

  VideoSandbox.prototype.setup = function(){
    var jv = $('video'); 
    var vs = this;
    jv.bind('timeupdate', function(){
      vs.syncState.apply(vs, []);
    });
    jv.bind('volumechange', function(){
      vs.syncState.apply(vs, []);
    });
  };

	VideoSandbox.prototype.playPause = function () {
    DEBUG && console.log('playPause called');
    if ($('video')[0].paused){
      $('video')[0].play();
    }else{
      $('video')[0].pause();
    }
    this.syncState();
	};

  VideoSandbox.prototype.syncState = function(){
    var v = $('video')[0];
    var state= {
      isPlaying: !v.paused,
      volume: Math.floor(v.volume*100),
      position: Math.floor((v.currentTime * 1.0 / v.duration) * 100)
    }; 
    this.callFunction('syncState', state);
  };

	VideoSandbox.prototype.setVolume = function (num) {
    DEBUG && console.log('setVolume called');
    $('video')[0].volume = num * 1.0 / 100;
	};
	
	VideoSandbox.prototype.refreshController = function () {
		DEBUG && console.log('refreshController called');
    this.resume();
	};

  VideoSandbox.prototype.resume = function(){
    $('.flex-control-nav li a')[1].click();
  };

  window.demoboPortal.addBobo(VideoSandbox);
})();
