(function(){var i=function(a,b){return function(){return a.apply(b,arguments)}},j=window,a=function(d,b){var c,e="",f=this;a.players[d]&&a.players[d].destroy();for(var g=0;g<a.binded_methods.length;g++)c=a.binded_methods[g],f[c]=i(f[c],f);this.options=b=b||{};this.values={status:a.STATUS_LOADING};this.values[a.CURRENT_STEP]=0;this.values[a.CURRENT_OBJECT]=null;this.callbacks=[];this.id=d;this.embedTo=document.getElementById(d);if(!this.embedTo)throw"The element id is not available.";this.iframe=document.createElement("iframe");
c=[{name:"oid",value:b.preziId},{name:"explorable",value:b.explorable?1:0},{name:"controls",value:b.controls?1:0}];for(g=0;g<c.length;g++)var h=c[g],e=e+((0===g?"?":"&")+h.name+"="+h.value);this.iframe.src=a.domain+a.path+e;this.iframe.frameBorder=0;this.iframe.width=b.width||640;this.iframe.height=b.height||480;this.embedTo.innerHTML="";this.embedTo.appendChild(this.iframe);this.initPollInterval=setInterval(function(){f.sendMessage({action:"init"})},200);a.players[d]=this};a.API_VERSION=1;a.CURRENT_STEP=
"currentStep";a.CURRENT_OBJECT="currentObject";a.STATUS_LOADING="loading";a.STATUS_READY="ready";a.STATUS_CONTENT_READY="contentready";a.EVENT_CURRENT_STEP="currentStepChange";a.EVENT_CURRENT_OBJECT="currentObjectChange";a.EVENT_STATUS="statusChange";a.EVENT_PLAYING="isAutoPlayingChange";a.EVENT_IS_MOVING="isMovingChange";a.domain="http://prezi.com";a.path="/player/";a.players={};a.binded_methods=["messageReceived","changesHandler"];a.createMultiplePlayers=function(d){for(var b=0;b<d.length;b++){var c=
d[b];new a(c.id,c)}};a.messageReceived=function(d){var b,c;try{b=JSON.parse(d.data)}catch(e){return}if(b.id&&(c=a.players[b.id])){!0===c.options.debug&&console&&console.log&&console.log("received",b);"changes"===b.type&&c.changesHandler(b);for(var f=0;f<c.callbacks.length;f++)(d=c.callbacks[f])&&b.type===d.event&&d.callback(b)}};a.prototype.changesHandler=function(a){var b,c,e,f;this.initPollInterval&&(clearInterval(this.initPollInterval),this.initPollInterval=!1);for(b in a.data)if(a.data.hasOwnProperty(b)){c=
a.data[b];this.values[b]=c;for(e=0;e<this.callbacks.length;e++)(f=this.callbacks[e])&&f.event===b+"Change"&&f.callback({type:f.event,value:c})}};a.prototype.destroy=function(){this.initPollInterval&&(clearInterval(this.initPollInterval),this.initPollInterval=!1);this.embedTo.innerHTML=""};a.prototype.sendMessage=function(d){!0===this.options.debug&&console&&console.log&&console.log("sent",d);d.version=a.API_VERSION;d.id=this.id;return this.iframe.contentWindow.postMessage(JSON.stringify(d),"*")};
a.prototype.nextStep=a.prototype.flyToNextStep=function(){return this.sendMessage({action:"present",data:["moveToNextStep"]})};a.prototype.previousStep=a.prototype.flyToPreviousStep=function(){return this.sendMessage({action:"present",data:["moveToPrevStep"]})};a.prototype.toStep=a.prototype.flyToStep=function(a){return this.sendMessage({action:"present",data:["moveToStep",a]})};a.prototype.toObject=a.prototype.flyToObject=function(a){return this.sendMessage({action:"present",data:["moveToObject",
a]})};a.prototype.play=function(a){return this.sendMessage({action:"present",data:["startAutoPlay",a]})};a.prototype.stop=function(){return this.sendMessage({action:"present",data:["stopAutoPlay"]})};a.prototype.pause=function(a){return this.sendMessage({action:"present",data:["pauseAutoPlay",a]})};a.prototype.getCurrentStep=function(){return this.values.currentStep};a.prototype.getCurrentObject=function(){return this.values.currentObject};a.prototype.getStatus=function(){return this.values.status};
a.prototype.isPlaying=function(){return this.values.isAutoPlaying};a.prototype.getStepCount=function(){return this.values.stepCount};a.prototype.getTitle=function(){return this.values.title};a.prototype.setDimensions=function(a){for(var b in a)this.iframe[b]=a[b]};a.prototype.getDimensions=function(){return{width:parseInt(this.iframe.width,10),height:parseInt(this.iframe.height,10)}};a.prototype.on=function(a,b){this.callbacks.push({event:a,callback:b})};a.prototype.off=function(a,b){var c,e;void 0===
a&&(this.callbacks=[]);for(c=this.callbacks.length;c--;)(e=this.callbacks[c])&&(e.event===a&&(void 0===b||e.callback===b))&&this.callbacks.splice(c,1)};window.addEventListener?window.addEventListener("message",a.messageReceived,!1):window.attachEvent("message",a.messageReceived);j.PreziPlayer=a})();

(function() {
	var DEBUG = false;
	var PreziBobo = window.Bobo.extend();

	PreziBobo.prototype.initialize = function() {
		this.setInfo('iconClass', 'fui-play-circle');
		this.setInfo('priority', 2);
		this.setInfo('boboID', 'prezi');
		this.setInfo('name', 'Remote Control for Prezi');
		this.setInfo('description', 'This is a remote control for presentations on Prezi');
		this.setInfo('type', 'specific');
		var ui = {
			isFullScreen : false
		};
		this.setInfo('ui', ui);
		this.setInfo('slideChangeTimeout', null);
		this.setController({
			url : 'http://rc1.demobo.com/v1/momos/prezi/control.html?0201',
			orientation : 'portrait'
		});

		this.setInputEventHandlers({
			'nextButton' : 'next',
			'prevButton' : 'previous',
			'screenButton' : 'toggleScreen',
			'demoboApp' : 'onReady',
			'demoboVolume' : 'onVolume'
		});
		
		var s = this;
		s.setupPreziPlayer();
		setTimeout(function() {
			s.refreshController.apply(s, []);
		}, 2000);
		document.addEventListener("keyup", function(event) {
			if (event.which == 27) {// esc trigger toggleScreen
				s.toggleScreen.apply(s, []);
			}
		}, true);
	};

	// ********** custom event handler functions *************
	PreziBobo.prototype.onReady = function() {
		this.refreshController();
	};

	PreziBobo.prototype.toggleScreen = function() {
		var ui = this.getInfo('ui');
		if (!ui.isFullScreen)
			this.fullScreen();
		else
			this.regularScreen();
		setTimeout(function(){
			demoboPreziPlayer.flyToStep(demoboPreziPlayer.getCurrentStep());
		},300);
		
	};
	
	PreziBobo.prototype.fullScreen = function() {
		var ui = this.getInfo('ui');
		if (!demoboPreziPlayer)
			return;
		jQuery('.prezi-player').css({
			position : 'absolute',
			top : 0,
			left : 0,
			'z-index' : 9998,
			width : '100%',
			height : '100%'
		});
		jQuery('#flashContainer').css({
			width : '100%',
			height : '100%'
		});
		jQuery('body').css({
			overflow : 'hidden'
		});
		ui.isFullScreen = true;
	};

	PreziBobo.prototype.regularScreen = function() {
		var ui = this.getInfo('ui');
		if (!demoboPreziPlayer)
			return;
		jQuery('.prezi-player').css({
			position : '',
			top : '',
			left : '',
			'z-index' : '',
			width : '',
			height : ''
		});
		jQuery('#flashContainer').css({
			width : '',
			height : ''
		});
		jQuery('body').css({
			overflow : ''
		});
		ui.isFullScreen = false;
	};
		
	PreziBobo.prototype.next = function() {
		demoboPreziPlayer.nextStep();
		// if (this.getCurrentPageNumber()+1 >= this.getPageCount()) return;
		// this._setSlide(this.getCurrentPageNumber() + 1);
	};

	PreziBobo.prototype.previous = function() {
		demoboPreziPlayer.previousStep();
		// if (this.getCurrentPageNumber()-1 < 0) return;
		// this._setSlide(this.getCurrentPageNumber() - 1);
	};

	PreziBobo.prototype.firstSlide = function() {
		this._setSlide(0);
	};

	PreziBobo.prototype.lastSlide = function() {
		this._setSlide(this.getPageCount()-1);
	};

	PreziBobo.prototype.setSlide = function(num) {
		var slideChangeTimeout = this.getInfo('slideChangeTimeout');
		if (slideChangeTimeout)
			clearTimeout(slideChangeTimeout);
		var s = this;
		this.setInfo('slideChangeTimeout', setTimeout(function() {
			s._setSlide(num);
			s.setInfo('slideChangeTimeout', null);
		}, 100));
	};

	PreziBobo.prototype._setSlide = function(num) {
		demoboPreziPlayer.flyToStep(num);
	};

	PreziBobo.prototype.refreshController = function() {
		// this.setCurrentPage(0);
	};

	PreziBobo.prototype.onVolume = function(value) {
		if (value == 'up')
			this.next();
		else if (value == 'down')
			this.previous();
	};

	/* helpers */
	PreziBobo.prototype.setupPreziPlayer = function() {
		// console.log("setupPreziPlayer", Prezi);
		$('#flashContainer iframe').hide();
		$('#flashContainer').append('<div id="demoboPreziPlayer" style="width:100%;height:100%;"></div>');
		demoboPreziPlayer = new PreziPlayer('demoboPreziPlayer', {
			preziId: Prezi.data.oid, 
			width: '100%',
			height: '100%',
			explorable: false,
			controls: true
		});
	};

	PreziBobo.prototype.setCurrentPage = function(num) {
		this.callFunction('setCurrentPage', num);
	};

	PreziBobo.prototype.getCurrentPageNumber = function() {
		return demoboPreziPlayer.getCurrentStep();
	};

	PreziBobo.prototype.getPageCount = function() {
		return demoboPreziPlayer.getStepCount();
	};

	window.demoboPortal.addBobo(PreziBobo);
})();

