(function() {
	//for development. comment out if it is not for dev
	var dev = true;
	//this is set through bookmarklet, default port of rc is 1280
	var rcPort = window.demoboRcPort || 1280;
	// this is set through bookmarklet, default port of demobo is 1281
	var demoboPort = window.demoboPort || 1281;
	var appVersion = "1119";
	var curDomain = document.domain.split('.').reverse();
	curDomain = curDomain[1] + '.' + curDomain[0];
	var appUrl = (dev ? 'http://localhost:' + rcPort + '/apps/' : 'http://rc1.demobo.com/apps/') + curDomain + '.js?' + appVersion;
	var apiUrl = "http://localhost:8082/demobo_1_4.js";
	
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