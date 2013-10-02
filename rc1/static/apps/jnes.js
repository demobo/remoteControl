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
			url : 'http://192.168.1.11:1240/v1/momos/jnes/control.html?245'
		});

		this.setInputEventHandlers({
			'keydown' : 'setKeyDown',
			'keyup' : 'setKeyUp',
			'allup' : 'setAllKeyUp',
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

	Jnes.prototype.setKeyDown = function(keyID, evt) {
		var num = this.Keyboard[keyID];

		var e = $.Event("keydown");
		e.keyCode = num;
		$(document).trigger(e);
	};

	Jnes.prototype.setKeyUp = function(keyID, evt) {
		var num = this.Keyboard[keyID];

		var e = $.Event("keyup");
		e.keyCode = num;
		$(document).trigger(e);
	};

	Jnes.prototype.setAllKeyUp = function(keyID, evt) {
		var arrowKeySet = [38, 40, 37, 39];

		for (var i = 0; i < 4; i++) {
			var e = $.Event("keyup");
			e.keyCode = arrowKeySet[i];
			$(document).trigger(e);
		}
		console.log('allup');
	};

	Jnes.prototype.Keyboard = {
		'up' : 38,
		'down' : 40,
		'left' : 37,
		'right' : 39,
		'select' : 17,
		'start' : 13,
		'A' : 88,
		'B' : 90,
	};

	window.demoboPortal.addBobo(Jnes);

})();
