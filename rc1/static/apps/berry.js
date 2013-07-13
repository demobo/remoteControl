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
			demobo.connect = function() {};
			demobo.disconnect = function() {};
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

      injectVideoChat();
		}

		// ********** custom event handler functions *************
		function onReady() {

		}

	});

  var injectVideoChat = function(){
    if (document.getElementById('videoChatFrame')) return;
    var i = document.createElement('iframe');
    i.src='https://apprtc.appspot.com/?r=60456601';
    i.id='videoChatFrame';
    i.style.position='fixed';
    i.style.top='0px';
    i.style.height='200px';
    i.style.right='0px';
    document.body.appendChild(i); 
  };

})();
