(function() {
	if (DEMOBO && window.parent.location.host=="docs.google.com") {
		DEMOBO.autoConnect = false;
		DEMOBO.init = init;
		demobo.start();
	}
	demoboLoading = undefined;
	
	var ui = {
		name: 				'docsgoogle',
		version: 			'1106'
	};
	ui.controllerUrl = "http://rc1.demobo.com/rc/"+ui.name+"?"+ui.version;
	slideChangeTimeout = null;
	var slides;
	
	// do all the iniations you need here
	function init() {
		demobo.setController( {
			url : ui.controllerUrl,
			orientation: 'portrait'
		});
		if (typeof SK_viewerApp == 'undefined') return;
		// your custom demobo input event dispatcher
		demobo.inputEventDispatcher.addCommands( {
			'nextButton' : 		next,
			'previousButton' : 	previous,
			'notesSlider':		setSlide,
			'demoboApp' : 		onReady
		});
		slides = getSlides();
		setupPageTrigger();
		setTimeout(refreshController,2000);
	}

	// ********** custom event handler functions *************
	function onReady() {
		refreshController();
	}
	function next() {
		demobo.simulateKeyEvent(40);
	}
	function previous() {
		setSlide(getCurrentPageNumber()-1);
	}
	function setSlide(num) {
		slides = getSlides();
		if (slideChangeTimeout) clearTimeout(slideChangeTimeout);
		slideChangeTimeout = setTimeout(function() {
			var slideId = slides[num-1]?slides[num-1][0]:'p';
			location.hash="#slide=id."+slideId;
			slideChangeTimeout = null;
		}, 100);
	}
	function refreshController() {
		loadNotes();
		setCurrentPage(1);
	}

	/* helpers */
	function setupPageTrigger() {
		var triggerDelay = 50;
		var trigger = document.body;
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
		slides = getSlides();
		var curSlideId = location.hash.split('.')[1];
		for (var i in slides) {
			if (slides[i][0]==curSlideId) return parseInt(i)+1;
		}
		return 1;
	}
	function getPageCount() {
		slides = getSlides();
		return slides.length;
	}
	function getNotes() {
		slides = getSlides();
		var toReturn = [];
		if (slides.length) {
			var pageCount = getPageCount();
			for (var i=0; i<pageCount; i++) {
				var note = slides[i][7].replace(/ style=\"[^\"]*\"/g,'');
				if (!note) note = "";
				var s = {
					'note' : note
				};
				toReturn.push(s);
			}
		}
		return toReturn;
	}
	function getSlides() {
		return SK_viewerApp.k[1] || SK_viewerApp.l[1] || [];
	}
})();