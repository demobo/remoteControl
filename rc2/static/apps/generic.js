(function() {
	// ******************* custom event handler functions ***************************

	var Help = window.Bobo.extend();

	Help.prototype.onReady = function() {
		console.log('onready is called');
	};

	// override the initialize function of Bobo
	Help.prototype.initialize = function() {
		console.log("generic init ...");
	};

	// add this adaptor to demoboPortal
	window.demoboPortal.addBobo(Help);

})();
