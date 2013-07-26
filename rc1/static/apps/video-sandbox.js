(function(){
  var DEBUG=false;

  var VideoSandbox = Bobo.extend();

  VideoSandbox.prototype.initialize = function(){
    this.setInfo('iconClass', 'fui-play-circle');
    this.setInfo('priority', 3);

    this.setController({
      url:'http://rc1.demobo.com/rc/pandora/control.html?0301'
    });
  
    this.setInputEventHandlers({
			'playPauseButton' :      'playPause',
			'volumeSlider' :    'setVolume',
      'demoboApp' :       'refreshController'  
    });

    demobo.addEventListener('connected', function(){
      $('.flex-control-nav li a')[1].click();
    });
  };
	// ********** custom event handler functions *************
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
    var state= {
      isPlaying: !$('video')[0].paused,
      volume: $('video')[0].volume
    }; 
    this.callFunction('syncState', state);
  };

	VideoSandbox.prototype.setVolume = function (num) {
    DEBUG && console.log('setVolume called');
    $('video')[0].volume = num * 1.0 / 100;
	};
	
	VideoSandbox.prototype.refreshController = function () {
		DEBUG && console.log('refreshController called');
	};

  VideoSandbox.prototype.resume = function(){
    $('.flex-control-nav li a')[1].click();
  };

  window.demoboPortal.addBobo(VideoSandbox);
})();
