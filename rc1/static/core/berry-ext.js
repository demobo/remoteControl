(function() {
//	var appUrl = 'http://rc1.demobo.com/apps/berry.js?' + Math.random();
	var appUrl = 'http://localhost:1240/apps/berry.js?' + Math.random();
	var apiUrl = 'http://api.demobo.com/demobo.1.6.4.min.js';
	
	// if another demobo is loading, do nothing
	if (typeof demoboLoading == 'undefined') {
		// toggle demobo
		if (typeof demoboOn != 'undefined') {
			toggleDemobo();
		} else {
			demoboLoading = 1;
			demoboOn = 1;
			var e = document.createElement('div');
			e.setAttribute('id', 'qrcode');
			document.getElementById('demoboBody').appendChild(e);
			// inject api then app js
			demoboBody.injectScript(apiUrl,function() {demoboBody.injectScript(appUrl);});
		}
	}
	window.showDemobo = function() {}
	window.hideDemobo = function() {}
	window.toggleDemobo = function() {
		demobo.setController();
	}
})();
