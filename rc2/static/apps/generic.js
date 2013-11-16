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
		demobo._sendToSimulator('urlChange', {
			url : window.location.href
		});
		demoboBody.addEventListener("FromExtension", function(e) {
			console.log("generic: ", e.detail);
		});
	};

	// add this adaptor to demoboPortal
	window.demoboPortal.addBobo(Generic);

})();
