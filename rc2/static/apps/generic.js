(function() {
	// ******************* custom event handler functions ***************************

	var Generic = window.Bobo.extend();

	Generic.prototype.onReady = function() {
		console.log('onready is called');
	};

	// override the initialize function of Bobo
	Generic.prototype.initialize = function() {
		console.log("Generic init ...");
		if (top === self) {
			demoboPortal.turnOnFavicon();
		}
		this.setController({
			url : 'generic'
		});
		
		if (top === self) {
			if (window.TogetherJS) {
				TogetherJSConfig_suppressJoinConfirmation = true;
				TogetherJSConfig_suppressInvite = true;
				TogetherJSConfig_disableWebRTC = true;
				TogetherJSConfig_youtube = true;
				TogetherJSConfig_dontShowClicks = false;
				TogetherJSConfig_cloneClicks = true;
			}
			demobo._sendToSimulator('event', {
				action : "getProperty"
			});
		}
		
		var syncId;
		var userName;
		demoboBody.addEventListener("FromExtension", function(e) {
			console.log("generic: ", e.detail);
			if (e.detail.id && e.detail.name) {
				syncId = e.detail.id;
				userName = e.detail.name;
			}
			if (!e.detail.data) return;
			var evtData = e.detail.data.data;
			switch(evtData.action) {
				case "turnOn":
					if (top === self) {
						demoboPortal.turnOnFavicon();
					}
					break;
				case "turnOff":
					if (top === self) {
						demoboPortal.turnOffFavicon();
						if (window.TogetherJS && TogetherJS.running) {
							TogetherJS(window);
						}
					}
					break;
				case "sync":
					if (top === self) {
						var url = window.location.href;
						demobo._sendToSimulator('event', {
							url : url,
							action : "urlChange"
						});
						if (window.TogetherJS && !TogetherJS.running) {
							TogetherJSConfig_getUserName = function () {return userName;};
							TogetherJS.startup._joinShareId = syncId;
							TogetherJS(window);
						}
						setTimeout(function(){
							demobo._sendToSimulator('event', {
								syncId : syncId,
								action : "syncMouse"
							});
						},3000);
					}
					break;
				case "urlChange":
					if (top === self) {
						if (window.location.href == evtData.url)
							return;
						window.location = evtData.url;
					}
					break;
				case "toggleSyncMouse":
					if (top === self) {
						if (window.TogetherJS) {
							TogetherJS(window);
							demobo._sendToSimulator('event', {
								syncId : syncId,
								action : "syncMouse"
							});
						}
					}
					break;		
				case "syncMouse":
					if (top === self) {
						if (window.TogetherJS && !TogetherJS.running) {
							if (evtData.syncId) {
								TogetherJSConfig_getUserName = function () {return userName;};
								TogetherJS.startup._joinShareId = evtData.syncId;
								TogetherJS(window);
							}
						}
					}
					break;	
				case "click":
					if (false && window.jQuery) {
						if (evtData.index >= 0)
							var dom = jQuery(evtData.selector)[evtData.index];
						else
							var dom = jQuery(evtData.selector);
					} else {
						if (evtData.index >= 0)
							var dom = document.getElementsByClassName(evtData.selector)[evtData.index];
						else
							var dom = document.getElementsByClassName(evtData.selector);
					}
					dom.click();
					break;
				default:
			}
		});

	};

	// add this adaptor to demoboPortal
	window.demoboPortal.addBobo(Generic);

})();
