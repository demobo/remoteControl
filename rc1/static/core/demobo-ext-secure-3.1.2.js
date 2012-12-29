(function() {
	var appVersion = "1130";
	var curDomain = document.domain.split('.').reverse();
	if (curDomain[1]=='google') curDomain = curDomain[2] + '.' + curDomain[1] + '.' + curDomain[0];
	else curDomain = curDomain[1] + '.' + curDomain[0];
	
	var appUrl = '//rc1-dot-de-mobo.appspot.com/apps/' + curDomain + '.js?' + appVersion;
	var apiUrl = '//api-dot-de-mobo.appspot.com/demobo.1.6.0.min.js';
	
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
			demoboBody.injectScript(apiUrl,function() {
				demoboBody.injectScript(appUrl, function() {
					demobo._sendToSimulator('setData', {key: 'url', value: location.href});
					document.getElementsByTagName('title')[0].addEventListener('DOMCharacterDataModified', function(){
						demobo._sendToSimulator('setData', {key: 'url', value: location.href});
					});
				});
			});
		}
	}
	window.showDemobo = function() {}
	window.hideDemobo = function() {}
	window.toggleDemobo = function() {
		demobo.setController();
	}
})();