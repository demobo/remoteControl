//(function() {
	if (DEMOBO) {
		DEMOBO.developer = 'developer@demobo.com';
		DEMOBO.autoConnect = false;
		DEMOBO.init = init;
		demobo.start();
	}
	demoboLoading = undefined;
	
	var ui = {
		name: 				'slideshare',
		version: 			'0201',
		nextButton: 		'.btnNext',
		previousButton: 	'.btnPrevious',
		firstButton: 		'.btnFirst',
		lastButton:			'.btnLast',
		pageNumber:			'.goToSlideLabel input',
		currentNote:		'.commentsNotes .slide-notes:visible',
		notes:				'#notesList li',
		pageCount:			'.goToSlideLabel span',
		pageTrigger: 		'.player'
	};
	ui.controllerUrl = "http://rc1.demobo.com/rc/"+ui.name+"?"+ui.version;
	slideChangeTimeout = null;
	
	// do all the iniations you need here
	function init() {
		demobo._sendToSimulator('setData', {key: 'url', value: location.href});
		demobo.setController( {
			url : ui.controllerUrl,
			orientation: 'portrait'
		});
		if (typeof player == 'undefined') return;
		// your custom demobo input event dispatcher
		demobo.mapInputEvents( {
			'nextButton' : 		next,
			'previousButton' : 	previous,
			'firstButton' : 	firstSlide,
			'lastButton' : 		lastSlide,
			'notesSlider':		setSlide,
			'demoboApp' : 		onReady,
			'demoboVolume' : 	onVolume
		});
		setupPageTrigger();
		setTimeout(refreshController,2000);
	}

	// ********** custom event handler functions *************
	function onReady() {
		refreshController();
	}
	function next() {
		_setSlide(getCurrentPageNumber()+1);
//		$(ui.nextButton).click();
	}
	function previous() {
		_setSlide(getCurrentPageNumber()-1);
//		$(ui.previousButton).click();
	}
	function firstSlide() {
		$(ui.firstButton).click();
	}
	function lastSlide() {
		$(ui.lastButton).click();
	}
	function setSlide(num) {
		if (slideChangeTimeout) clearTimeout(slideChangeTimeout);
		slideChangeTimeout = setTimeout(function() {
			_setSlide(num);
			slideChangeTimeout = null;
		}, 100);
	}
	function _setSlide(num) {
		if (player.controller) player.controller.play(num);
		else player.jumpTo(num);
	}
	function refreshController() {
		loadNotes();
		setCurrentPage(1);
	}
	function onVolume(value) {
		if (value=='up') next();
		else if (value=='down') previous();
	}
	/* helpers */
	function setupPageTrigger() {
		var triggerDelay = 50;
		if (player.controller) var trigger = $(ui.pageTrigger)[0];
		else var trigger = $('body')[0];
		var _this = {
			oldValue : getCurrentPageNumber()
		};
		var onChange = function() {
			var newValue = getCurrentPageNumber();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				setCurrentPage(newValue);
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	}
	function loadNotes() {
		demobo.callFunction('loadNotes', getNotes());
	}
	function setCurrentPage(num) {
		demobo.callFunction('setCurrentPage', num);
	}
	function getCurrentPageNumber() {
		if (player.controller) return parseInt(player.controller.currentPosition);
		else return player.getCurrentSlide();
	}
	function getPageCount() {
		if (player.controller) return player.controller.slideCount;
		else return slideshare_object.totalSlides;
	}
	function getNotes() {
		var toReturn = [];
		if ($(ui.notes).length) {
			var pageCount = getPageCount();
			for (var i=0; i<pageCount; i++) {
				var note = $($(ui.notes)[i]).html();
				if (!note) note = "";
				var s = {
					'note' : note
				};
				toReturn.push(s);
			}
		}
		return toReturn;
	}
//})();