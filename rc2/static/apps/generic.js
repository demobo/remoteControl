(function() {
	// ******************* custom event handler functions ***************************

	var Generic = window.Bobo.extend();

	Generic.prototype.onReady = function() {
		console.log('onready is called');
	};

	// override the initialize function of Bobo
	Generic.prototype.initialize = function() {
		console.log("Generic init ...");
		console.log(window.location.href);
		this.setController({
			url : 'generic'
		});
		demobo._sendToSimulator('event', {
			url : window.location.href,
			action : "urlUpdate"
		});
		demoboBody.addEventListener("FromExtension", function(e) {
			console.log("generic: ", e.detail);
			var evtData = e.detail.data.data;
			switch(evtData.action) {
				case "sync":
					demobo._sendToSimulator('event', {
						url : window.location.href,
						action : "urlChange"
					});
					break;
				case "urlChange":
					if (window.location.href == evtData.url)
						return;
					window.location = evtData.url;
					break;
				case "click":
					if (evtData.index >= 0)
						var dom = jQuery(evtData.selector)[evtData.index];
					else
						var dom = jQuery(evtData.selector);
					dom.click();
					break;
				default:
			}
		});


		function onClickByClassName(className) {
			jQuery(document).on("mouseup", className, function(e) {
				var index = jQuery(className).index(e.currentTarget);
				demobo._sendToSimulator('event', {
					selector : className,
					index : index,
					action : 'click'
				});
				console.log("click", className, index);
			});
		}
		
		if (window.jQuery) {
			onClickByClassName('.btnNext');
			onClickByClassName('.btnPrevious');
			onClickByClassName('.btn.next');
			onClickByClassName('.btn.prev');
			onClickByClassName('.list-card');
			onClickByClassName('.icon-close');
		}
	};

	// add this adaptor to demoboPortal
	window.demoboPortal.addBobo(Generic);

})();
