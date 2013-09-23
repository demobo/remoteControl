(function() {
	var DEBUG = false;

	var Jnes = Bobo.extend();

	Jnes.prototype.initialize = function() {
		this.setInfo('priority', 2);
		this.setInfo('boboID', 'jnes');
		this.setInfo('name', 'Remote Control for jnes');
		this.setInfo('description', 'This is a remote control for jnes');
		this.setInfo('type', 'specific');

		//overwrites the 'setInputEventHandlers'
		this.setInputEventHandlers = function(inputEventHandlers) {
			var eventName, handlerName, hs, wrapper, _thisBobo;

			_thisBobo = this;
			wrapper = function(bobo, functionName) {
				return function() {
					//check if an Eventlistener is existed on the jPlayer, if not, add one.
					// bobo.addJplayerListener();
					// bobo.addNewsTitleListener();
					//...
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
			url : 'http://192.168.1.11:1240/v1/momos/jnes/control.html?123'
		});

		this.setInputEventHandlers({
			'keydown' : 'setKeyDown',
			'keyup' : 'setKeyUp',
			// 'demoboVolume' :   	'onVolume',
			// 'demoboApp' : 	  	'onReady',
		});

		this.setInfo('last3PlayedSongs', []);
		this.setInfo('curState', {
			isPlaying : false,
			volume : 50
		});
		this.setInfo('slideChangeTimeout', null);
		this.setInfo('ui', {
			// playPauseButton: 	'.sprite-play:visible, .sprite-pause:visible',
		});
		// this.setupSongTrigger();
		// this.setupStationTrigger();
		// this.setupStateTrigger();
	};

	Jnes.prototype.setKeyDown = function(keycode, evt) {
		num = parseInt(keycode);
		console.log(keycode);
		console.log(evt);
		
		var e = $.Event("keydown");
		e.keyCode=keycode;
		$(document).trigger(e);
	};
	
	Jnes.prototype.setKeyUp = function(keycode, evt) {
		num = parseInt(keycode);
		console.log(keycode);
		console.log(evt);
		
		var e = $.Event("keyup");
		e.keyCode=keycode;
		$(document).trigger(e);
	};
	
	
	window.demoboPortal.addBobo(Jnes);

})();
