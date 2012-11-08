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
		version: 			'1028',
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
	
	// do all the iniations you need here
	function init() {
		demobo.setController( {
			url : ui.controllerUrl,
			orientation: 'portrait'
		});
		// your custom demobo input event dispatcher
		demobo.inputEventDispatcher.addCommands( {
			'nextButton' : 		next,
			'previousButton' : 	previous,
			'firstButton' : 	firstSlide,
			'lastButton' : 		lastSlide,
			'notesSlider':		setSlide,
			'demoboApp' : 		onReady
		});
		setupPageTrigger();
		setTimeout(refreshController,2000);
	}

	// ********** custom event handler functions *************
	function onReady() {
		refreshController();
	}
	function next() {
		$(ui.nextButton).click();
	}
	function previous() {
		$(ui.previousButton).click();
	}
	function firstSlide() {
		$(ui.firstButton).click();
	}
	function lastSlide() {
		$(ui.lastButton).click();
	}
	function setSlide(num) {
		$.slideshareEventManager.controller.play(num);
	}
	function refreshController() {
		loadNotes();
		setCurrentPage(1);
	}

	/* helpers */
	function setupPageTrigger() {
		var triggerDelay = 50;
		var trigger = $(ui.pageTrigger)[0];
		var _this = {
			oldValue : getCurrentPageNumber()
		};
		var onChange = function() {
			var newValue = getCurrentPageNumber();
			console.log('page changed', newValue);
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
		return $.slideshareEventManager.controller.currentPosition;
	}
	function getPageCount() {
		return $.slideshareEventManager.controller.slideCount;
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