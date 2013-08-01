(function() {
  /*
    GoogleDocs creates a new iframe element after "Present" button is clicked, needa inject script after then.
  */
  var DEBUG=false;
  var GoogleDocs = window.Bobo.extend();
  
  GoogleDocs.prototype.hasPresentButton = function (){
    return !!document.getElementById("punch-start-presentation-left");
  }

  GoogleDocs.prototype.insertScript = function (){
    document.getElementById("punch-start-presentation-left").onclick=function(){
      var s = document.createElement('script');
      if (!DEBUG){
        s.innerHTML = '((function(c){var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e="//d1hew6xzj9n4kw.cloudfront.net";window.demoboBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))';
      }else{
        s.innerHTML = '((function(c){var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e=(document.location.protocol==="https:")?"https://localhost:443":"http://localhost:1240";window.demoboBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))';
      }
      setTimeout(function(){
        var iframe = document.querySelector('.punch-full-window-overlay');
        if (iframe){
          iframe.contentWindow.document.body.appendChild(s);
        }
      }, 4000);
    };
  }

  GoogleDocs.prototype.initialize = function (){
    this.setController({
      url:'http://rc1.demobo.com/v1/momos/docsgoogle/control.html?0201',
      orientation: 'portrait'
    });

    if (this.hasPresentButton()){
      this.insertScript();
      return;
    };

    this.setInfo('iconClass', 'fui-play-circle');
    this.setInfo('priority', 2);
    this.setInfo('boboID', 'googledocs');
    
    this.setInfo('slideChangeTimeout', null);

		if (typeof SK_viewerApp == 'undefined') return;

		this.setInputEventHandlers( {
			'nextButton' : 		  'next',
			'previousButton' : 	'previous',
			'notesSlider':		  'setSlide',
			'demoboApp' : 		  'onReady',
			'demoboVolume' : 	  'onVolume'
		});

    var gd = this;
    this.setInfo('slides', this.getSlides());
    this.setupPageTrigger();
    setTimeout(function(){
      gd.refreshController.apply(gd, []);
    }, 2000);
  };
    
	// ********** custom event handler functions *************
	GoogleDocs.prototype.onReady = function () {
		this.refreshController();
	};

	GoogleDocs.prototype.next = function () {
		this.simulateKeyEvent(40);
	};

  GoogleDocs.prototype.simulateKeyEvent = function(a) {
    this.dispatchKeyboardEvent(document, "keydown", !0, !0, null, a, 0, "");
    this.dispatchKeyboardEvent(document, "keypress", !0, !0, null, a, 0, "");
    this.dispatchKeyboardEvent(document, 
    "keyup", !0, !0, null, a, 0, "")
  };

  GoogleDocs.prototype.dispatchKeyboardEvent = function(a, b) {
      var c = document.createEvent("KeyboardEvents");
      c.initKeyboardEvent.apply(c, Array.prototype.slice.call(arguments, 1));
      a.dispatchEvent(c)
  };

	GoogleDocs.prototype.previous = function () {
		this.setSlide(this.getCurrentPageNumber()-1);
	};

	GoogleDocs.prototype.setSlide = function (num) {
    var slideChangeTimeout = this.getInfo('slideChangeTimeout');
		var slides = this.getSlides();
    var sd = this;
		if (slideChangeTimeout) clearTimeout(slideChangeTimeout);
		this.setInfo('slideChangeTimeout', setTimeout(function() {
			var slideId = slides[num-1]?slides[num-1][0]:'p';
			location.hash="#slide=id."+slideId;
      sd.setInfo.apply(sd, ['slideChangeTimeout', null]);
		}, 100));
	};

	GoogleDocs.prototype.refreshController = function () {
		this.loadNotes();
		this.setCurrentPage(1);
	};

	GoogleDocs.prototype.onVolume = function (value) {
		if (value=='up') this.next();
		else if (value=='down') this.previous();
	};

	/* helpers */
	GoogleDocs.prototype.setupPageTrigger = function () {
		var triggerDelay = 50;
		var trigger = document.body;
    var gd = this;
		var _this = {
			oldValue : this.getCurrentPageNumber()
		};
		var onChange = function() {
			var newValue = gd.getCurrentPageNumber.apply(gd, []);
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				gd.setCurrentPage.apply(gd, [newValue]);
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	GoogleDocs.prototype.loadNotes = function () {
	  this.callFunction('loadNotes', this.getNotes());
	};

	GoogleDocs.prototype.setCurrentPage = function (num) {
		this.callFunction('setCurrentPage', num);
	};

	GoogleDocs.prototype.getCurrentPageNumber = function () {
		var slides = this.getSlides();
		var curSlideId = location.hash.split('.')[1];
		for (var i in slides) {
			if (slides[i][0]==curSlideId) return parseInt(i)+1;
		}
		return 1;
	};

	GoogleDocs.prototype.getPageCount = function () {
		var slides = this.getSlides();
		return slides.length;
	};

	GoogleDocs.prototype.getNotes = function () {
		var slides = this.getSlides();
		var toReturn = [];
		if (slides.length) {
			var pageCount = this.getPageCount();
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
	};

	GoogleDocs.prototype.getSlides = function () {
		return SK_viewerApp.k[1] || SK_viewerApp.l[1] || SK_viewerApp.n[1] || this._getSlides();
	};

	GoogleDocs.prototype._getSlides = function () {
		for (var i in SK_viewerApp) { if (SK_viewerApp[i] && Array.isArray(SK_viewerApp[i][1])) return SK_viewerApp[i][1]; }
		return [];
	};

  window.demoboPortal.addBobo(GoogleDocs);
})();
