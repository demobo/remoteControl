function setDemoboController() {
	demobo.setController( {
		url : "http://rc1.demobo.com/rc/douban?0830"
	});
}

function demoboInitiation() {
	// make sure the target is an element that will not be destroyed after meta data updates
	var _this = {
		target : $('head title')[0],
		oldValue : document.title
	};
	_this.onChange = function() {
		if (_this.oldValue !== document.title) {
			_this.oldValue = document.title;
			sendCurrentSongInfo();
		}
	};
	_this.delay = function() {
		setTimeout(_this.onChange, 1);
	};
	_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
}

// your custom demoboApp event dispatcher
demoboInputDispatcher.addCommands( {
	'playPauseButton' : playPause,
	'loveButton' : love,
	'spamButton' : ban,
	'nextButton' : next,
	'channelTab' : sendChannelList,
	'stationItem' : changeChannel,
	'demoboApp' : function() {
		sendChannelList();
		sendCurrentSongInfo();
		hideDemobo();
	}
});

// ********** custom event handler functions *************
function playPause() {
	DBR.act('pause');
}

function next() {
	DBR.act('skip');
}

function love() {
	DBR.act('love');
}

function ban() {
	DBR.act('ban');
}

function sendChannelList() {
	var list = $.map($('.channel'), function(value, index) {
		var s = {
			'title' : $(value).find('.chl_name').text()
		};
		if ($(value).hasClass('selected'))
			s.selected = true;
		return s;
	});
	demobo.callFunction('loadChannelList', list);
}

function changeChannel(index) {
	index = parseInt(index);
	$($('.chl_name')[index]).trigger('click');
}

/* helpers */
function getNowPlayingData() {
	var temp = FM.getCurrentSongInfo();
	return {
		'title' : temp['songName'],
		'artist' : temp['artistName'],
		'image' : temp['coverUrl']
	};
}

function getCurrentStationIndex() {
	var toReturn = 0;
	var list = $.map($('.channel'), function(value, index) {
		if ($(value).hasClass('selected'))
			toReturn = index;
	});
	return toReturn;
}

function sendCurrentSongInfo() {
	demobo.callFunction('loadSongInfo', getNowPlayingData());
	demobo.callFunction('setCurrentChannel', getCurrentStationIndex());
}

function setDevice(data) {
	device = data;
	console.log(device);
	if (data) {
		hideDemobo();
		setDemoboController();
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
	var device;
	// event that detect change of song
	demoboInitiation();
	demoboLoading = undefined;
})();