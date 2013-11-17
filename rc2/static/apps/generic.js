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
		var robotClick = false;
		this.setController({
			url : 'generic'
		});
		demobo._sendToSimulator('urlUpdate', {
			url : window.location.href
		});
		demoboBody.addEventListener("FromExtension", function(e) {
			console.log("generic: ", e.detail);
			var evtData = e.detail.data.data;
			switch(evtData.action) {
				case "urlChange":
					if (window.location.href == evtData.url)
						return;
					window.location = evtData.url;
					break;
				case "click":
					robotClick = true;
					jQuery(evtData.selector)[evtData.index].click();
					setTimeout(function(){
						robotClick = false;
					},100);
					break;
				default:

			}
		});
		if (window.jQuery) {
			jQuery('.list-card').click(function(e) {
				if (robotClick) return;
				var index = $('.list-card').index(e.currentTarget);
				demobo._sendToSimulator('event', {
					selector : '.list-card',
					index : index,
					action : 'click'
				});
			});
		}
	};

	// add this adaptor to demoboPortal
	window.demoboPortal.addBobo(Generic);

})();
