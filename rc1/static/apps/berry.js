(function() {
	var ui = {
		name : 'youtube',
		version : '0130'
	};
	demoboBody.injectScript('//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function() {
		jQuery.noConflict();
		if (DEMOBO) {
			DEMOBO.autoConnect = true;
			DEMOBO.init = init;
			demobo.start();
		}
		demoboLoading = undefined;

		ui.controllerUrl = "http://rc1.demobo.com/rc/" + ui.name + "?" + ui.version;

		// do all the iniations you need here
		function init() {
			demobo._sendToSimulator('setData', {
				key : 'url',
				value : location.href
			});
			demobo.setController({
				url : ui.controllerUrl,
				orientation : 'portrait'
			});
			// your custom demobo input event dispatcher
			demobo.mapInputEvents({
				'demoboApp' : onReady,
			});
		}

		// ********** custom event handler functions *************
		function onReady() {

		}

	});
})();
