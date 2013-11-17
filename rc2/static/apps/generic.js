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
		demobo._sendToSimulator('urlUpdate', {
			url : window.location.href,
			action : "urlUpdate"
		});
		demoboBody.addEventListener("FromExtension", function(e) {
			console.log("generic: ", e.detail);
			var evtData = e.detail.data.data;
			switch(evtData.action) {
				case "sync":
					demobo._sendToSimulator('urlChange', {
						url : window.location.href,
						action : "urlChange""
					});
					break;
				case "load":
					// demobo._sendToSimulator('urlChange', {
						// url : window.location.href,
						// action : "urlChange""
					// });
					// if (window.location.href == evtData.url)
						// return;
					// window.location = evtData.url;
					break;
				case "urlChange":
					if (window.location.href == evtData.url)
						return;
					window.location = evtData.url;
					break;
				case "click":
					if (evtData.index>=0)
						var dom = jQuery(evtData.selector)[evtData.index];
					else
						var dom = jQuery(evtData.selector);
					dom.click();
					break;
				default:

			}
		});
		if (window.jQuery) {
			jQuery('.btn.next').on( "click", function(e) {
				console.log("next click");
				demobo._sendToSimulator('event', {
					selector : '.btn.next',
					index : -1,
					action : 'click'
				});
			});
			jQuery('.btn.prev').on( "click", function(e) {
				console.log("prev click");
				demobo._sendToSimulator('event', {
					selector : '.btn.prev',
					index : -1,
					action : 'click'
				});
			});
			jQuery( '.list-card' ).on( "click", function(e) {
				var index = jQuery('.list-card').index(e.currentTarget);
				console.log("list: ", index);
				demobo._sendToSimulator('event', {
					selector : '.list-card',
					index : index,
					action : 'click'
				});
			});

			jQuery( document ).on( "click", '.icon-close', function(e) {
				console.log("close: ", index);
				demobo._sendToSimulator('event', {
					selector : '.icon-close',
					index : -1,
					action : 'click'
				});
			});
		}
	};

	// add this adaptor to demoboPortal
	window.demoboPortal.addBobo(Generic);

})();
