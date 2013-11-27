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
					if (top === self) {
						demobo._sendToSimulator('event', {
							url : window.location.href,
							action : "urlChange"
						});
					}
					break;
				case "urlChange":
					if (top !== self)
						return;
					if (window.location.href == evtData.url)
						return;
					window.location = evtData.url;
					break;
				case "click":
					if (window.jQuery) {
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

		function setUpListenerByClassName(delegatorClassName, elementClassName, eventName) {
			var delegator = document.getElementsByClassName(delegatorClassName)[0];
			setUpListener(delegator, elementClassName, eventName);
		}

		function setUpListener(delegator, elementClassName, eventName) {
			delegator.addEventListener(eventName, function(event) {
				event = event || window.event;
				var target = event.target || event.srcElement;
				while (target && target != delegator) {
					if (target && target.classList.contains(elementClassName)) {
						var targets = Array.prototype.slice.call(document.getElementsByClassName(elementClassName));
						console.log(elementClassName, targets, target);
						var index = Array.prototype.indexOf.call(targets, target);
						// demobo._sendToSimulator('event', {
							// selector : elementClassName,
							// index : index,
							// action : eventName
						// });
						console.log("click", elementClassName, index);
						break;
					}
					target = target.parentNode;
				}
			});
		}
		
		function a(elementClassName) {
			var targets = window.document.getElementsByClassName(elementClassName);
			console.log(elementClassName, targets);
		}

		if (window.jQuery) {
			onClickByClassName('.btnNext');
			onClickByClassName('.btnPrevious');

			onClickByClassName('.btn.next');
			onClickByClassName('.btn.prev');

			onClickByClassName('.list-card');
			onClickByClassName('.icon-close');

			onClickByClassName('.filename-col img');
			onClickByClassName('.filename-col a');
		} else {
			setUpListenerByClassName('clsDesktopActionTabWrapper', 'clsDesktopActionTab', 'click');
		}
	};

	// add this adaptor to demoboPortal
	window.demoboPortal.addBobo(Generic);

})();
