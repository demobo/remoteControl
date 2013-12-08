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
		if (top === self) {
			demoboPortal.turnOnFavicon();
		}
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
				case "turnOn":
					if (top === self) {
						demoboPortal.turnOnFavicon();
					}
					break;
				case "turnOff":
					if (top === self) {
						demoboPortal.turnOffFavicon();
					}
					break;
				case "sync":
					if (top === self) {
						var url;
						if (window.TogetherJS && TogetherJS.running) url = window.TogetherJS.shareUrl();
						else url = window.location.href;
						demobo._sendToSimulator('event', {
							url : url,
							action : "urlChange"
						});
					}
					break;
				case "urlChange":
					if (top === self) {
						if (window.location.href == evtData.url)
							return;
						window.location = evtData.url;
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

		function setUpListenerByClassName(delegatorClassName, elementClassName) {
			var delegator = document.getElementsByClassName(delegatorClassName)[0];
			if (delegator)
				setUpListener(delegator, elementClassName);
		}

		function setUpListener(delegator, elementClassName) {
			delegator.addEventListener("mouseup", function(event) {
				event = event || window.event;
				var target = event.target || event.srcElement;
				while (target && target != delegator) {
					if (target && target.classList.contains(elementClassName)) {
						var targets = Array.prototype.slice.call(document.getElementsByClassName(elementClassName));
						var index = Array.prototype.indexOf.call(targets, target);
						console.log('click', elementClassName, index);
						demobo._sendToSimulator('event', {
							selector : elementClassName,
							index : index,
							action : 'click'
						});
						break;
					}
					target = target.parentNode;
				}
			});
		}

		if (false && window.jQuery) {
			onClickByClassName('.btnNext');
			onClickByClassName('.btnPrevious');

			onClickByClassName('.btn.next');
			onClickByClassName('.btn.prev');

			onClickByClassName('.list-card');
			onClickByClassName('.icon-close');

			onClickByClassName('.filename-col img');
			onClickByClassName('.filename-col a');
		} else {
			setUpListener(document, 'btnNext');
			setUpListener(document, 'btnPrevious');

			// do not accept 'btn next'
			setUpListener(document, 'btn');
			
			setUpListener(document, 'list-card');
			setUpListener(document, 'icon-close');

			setUpListenerByClassName('clsDesktopActionTabWrapper', 'clsDesktopActionTab');
			setUpListener(document, 'clsBorderBox');
		}
	};

	// add this adaptor to demoboPortal
	window.demoboPortal.addBobo(Generic);

})();
