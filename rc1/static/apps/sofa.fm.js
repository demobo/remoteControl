(function() {
  // ******************* custom event handler functions ***************************

  var Sofafm = window.Bobo.extend();

  Sofafm.prototype.onReady = function() {
    window.onReady();
  };

  Sofafm.prototype.playPause= function (){
    window.playPause();
  };

  Sofafm.prototype.rewind= function (){
    window.rewind();
  };

  Sofafm.prototype.fastForward= function (){
    window.fastForward();
  };

  Sofafm.prototype.setVolume= function (){
    window.setVolume();
  };

  Sofafm.prototype.searchKeyword= function (){
    window.searchKeyword();
  };

  Sofafm.prototype.playClip= function (){
    window.playClip();
  };

  Sofafm.prototype.playNowplaying= function (){
    window.playNowplaying();
  };

  Sofafm.prototype.addClip= function (){
    window.addClip();
  };

  Sofafm.prototype.removeClip= function (){
    window.removeClip();
  };

  Sofafm.prototype.next= function (){
    window.next();
  };

  Sofafm.prototype.prev= function (){
    window.prev();
  };

  Sofafm.prototype.onVolume= function (){
    window.onVolume();
  };

  Sofafm.prototype.reload= function (){
    window.reload();
  };

  Sofafm.prototype.toggleScreen= function (){
    window.toggleScreen();
  };

  Sofafm.prototype.cutSong= function (){
    window.cutSong();
  };

  Sofafm.prototype.nowPlayingScroll= function (){
    window.nowPlayingScroll();
  };

  Sofafm.prototype.loadPlaylist= function (){
    window.loadPlaylist();
  };

  // override the initialize function of Bobo
  Sofafm.prototype.initialize = function() {
    this.setInfo('iconClass', 'fui-play-circle');
    this.setInfo('boboID', 'sofafm');
    this.setInfo('name', 'Remote Control for SofaFm');
    this.setInfo('description', 'This is a remote control for SofaFm');
    this.setInfo('type', 'specific');
    this.setInfo('index', 2);

    this.setController({
		  url : "http://www.sofa.fm/mobile/index.html",
      orientation : 'portrait'
    });

    this.setInputEventHandlers({
      'demoboApp' :         'onReady',
  		'playPauseButton' :   'playPause',
  		'rewindButton' :      'rewind',
  		'fastforwardButton' : 'fastForward',
  		'volumeSlider' :      'setVolume',
  		'searchKeyword' :     'searchKeyword',
  		'playClip' :          'playClip',
  		'playNowplaying' :    'playNowplaying',
  		'addClip' :           'addClip',
  		'removeClip' :        'removeClip',
  		'nextButton' :        'next',
  		'prevButton' :        'prev',
  		'demoboVolume' :      'onVolume',
  		'reloadButton':	      'reload',
  		'fullScreenButton':	  'toggleScreen',
  		'deleteButton':       'cutSong',
  		'nowPlayingScroll':   'nowPlayingScroll',
  		'loadPlaylist':       'loadPlaylist'
    });

  };

  // add this app to demoboPortal
  window.demoboPortal.addBobo(Sofafm);

})();
