function setDemoboController() {
	demobo.setController( {
		url : "http://rc1.demobo.com/rc/pandora?0901"
	});
	setTimeout(refreshController,1000);
}

function demoboInitiation() {
	// make sure the target is an element that will not be destroyed after meta data updates
	var _this = {
		target : $('.albumArt')[0],
		oldValue : $('.playerBarArt').attr('src')
	};
	_this.onChange = function() {
		var newValue = $('.playerBarArt').attr('src');
		if (newValue && _this.oldValue !== newValue) {
			_this.oldValue = newValue;
			sendNowPlaying();
		}
	};
	_this.delay = function() {
		setTimeout(_this.onChange, 30);
	};
	_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
}

// your custom demoboApp event dispatcher
demoboInputDispatcher.addCommands( {
	'playButton' : play,
	'pauseButton' : pause,
	'loveButton' : thumbUp,
	'spamButton' : thumbDown,
	'nextButton' : next,
	'volumeSlider' : setVolume,
	'stationItem' : chooseStation,
	'nowPlayingTab' : refreshController,
	'stationsTab' : refreshController,
	'demoboApp' : function() {
		refreshController();
		hideDemobo();
	}
});

//********** custom event handler functions *************
function play() {
	$('.playButton').click();
}

function pause() {
	$('.pauseButton').click();
}

function next() {
	$('.skipButton').click();
}

function thumbUp() {
	$('.thumbUpButton').click();
}

function thumbDown() {
	$('.thumbDownButton').click();
}

function setVolume(num) {
	num = parseInt(num);
	$('.volumeBackground').show();
	var min = getAbsPosition($('.volumeBar')[0]).left + 22;
	var max = min + $('.volumeBar').width();
	var target = Math.floor(num / 100.0 * (max - min)) + min - 22;
	console.log('min: ' + min + ';max: ' + max + ';target: ' + target);
	$('.volumeBackground').show().trigger( {
		type : 'click',
		pageX : target
	});
}

function chooseStation(index) {
	index = parseInt(index);
	$($('.stationNameText')[index]).click();
}

function refreshController() {
	sendStationList();
	sendNowPlaying();
}

/* helpers */
function getAbsPosition(element) {
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
}

function getNowPlayingData() {
	return {
		'title' : $('.songTitle').text(),
		'artist' : $('.artistSummary').text(),
		'album' : $('.albumTitle').text(),
		'image' : $('.playerBarArt').attr('src')
	};
}

function getStationList() {
	var toReturn = [];
	$.each($('.stationListItem').has('.stationNameText'),
			function(index, elem) {
				var s = {
					'title' : $(elem).find('.stationNameText').text()
				};
				if ($(elem).hasClass('selected'))
					s.selected = true;
				toReturn.push(s);
			});
	return toReturn;
}

function getCurrentStationIndex() {
	var toReturn = 0;
	$.each($('.stationListItem').has('.stationNameText'),
			function(index, elem) {
				if ($(elem).hasClass('selected'))
					toReturn = index;
			});
	return toReturn;
}

function sendStationList() {
	demobo.callFunction('loadChannelList', getStationList());
}

//<<<<<<< HEAD
function setController(){
  DEMOBO.controller = {page: "default", url:"http://rc1.demobo.com/rc/pandora", touchEnabled: true};
// DEMOBO.controller = {"page": "presentation"};  
  demobo.setController(DEMOBO.controller);  
}

function setDevice(data) {
  device = data;
  console.log(device);
  hideDemobo();
}

myInputDispatcher.addCommands({
  'playButton' : playVideo ,
  'pauseButton' : pauseVideo ,
  'loveButton' : thumbUp ,
  'spamButton' : thumbDown ,
  'nextButton' : skipVideo ,
  'volumeSlider' : setVolume ,
  'nowPlayingTab' : sendPhoneInfo ,
  'stationsTab' : sendStationList ,
  'stationItem' : chooseStation ,
  'demoboApp' : function(){
    sendPhoneInfo();
    sendStationList();
    hideDemobo();
  }
});


function myInitiation(){
  //TODO: 1 bind external function doesn't work
  $('.albumArt').bind('ajaxComplete', function(e){
    var newPic = d$('.albumArt').children().last().attr('src');
    console.log('new:'+ newPic+';old:'+currentPic);
    if (newPic != currentPic){
      currentPic = newPic;
      sendPhoneInfo();
    }
  });
  var device;
  var a = document.createElement('div');
  a.setAttribute('onclick','javascript:document.querySelector(".playButton").click()');
  a.setAttribute('id', 'demoboPlay');
  var b = document.createElement('div');
  b.setAttribute('onclick','javascript:document.querySelector(".pauseButton").click()');
  b.setAttribute('id', 'demoboPause');
  document.body.appendChild(a);
  document.body.appendChild(b);

}

//main logic
(function(){
  console.log('fuck');
  if (DEMOBO) {
    //developer authentication, now hardcoded
    DEMOBO.developer = 'developer@demobo.com';
    DEMOBO.maxPlayers = 1;
    DEMOBO.stayOnBlur = true;
    DEMOBO.init = function(){
      setController();
      demobo.addEventListener('input', function(e){
        console.log(e);
//        var evt = {source: e.source, value: e.value};
//        handleRemoteInput(evt);
        myInputDispatcher.execCommand(e.source, e.value);
      });
      demobo.addEventListener('connected', function(e){
        console.log('connected');
      });
      showDemobo();
      demobo.getDeviceInfo('','setDevice');
    }
  }

  demobo.start();

  var currentPic;
  
  console.log('here');

  myInitiation();

  demoboLoading = undefined;
  localStorage.removeItem('demoboExtLoading');
}());



//=======
function sendNowPlaying() {
	demobo.callFunction('loadSongInfo', getNowPlayingData());
	demobo.callFunction('setCurrentChannel', getCurrentStationIndex());
}

function setDevice(data) {
	if (data) {
		console.log(data);
		hideDemobo();
	}
}

//dont modify the codes below if you dont know what you are doing
(function() {
	if (DEMOBO) {
		DEMOBO.developer = 'developer@demobo.com';
		DEMOBO.maxPlayers = 1;
		DEMOBO.stayOnBlur = true;
		DEMOBO.init = function() {
			// set controller for existing devices
			setDemoboController();
			demobo.addEventListener('input', function(e) {
				console.log(e);
				demoboInputDispatcher.execCommand(e.source, e.value);
			});
			demobo.addEventListener('connected', function(e) {
				console.log('connected');
				// set controller for newly connected devices
				setDemoboController();
			});
			showDemobo();
			demobo.getDeviceInfo('', 'setDevice');
		}
		demobo.start();
	}
	var currentPic;
	demoboInitiation();
	demoboLoading = undefined;
}());
//>>>>>>> master
