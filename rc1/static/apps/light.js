(function() {
	var ui = {
		name : 'lightcontrol',
		version : '0712'
	};

	demoboBody.injectScript('//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function() {
		demoboBody.injectScript('https://cdn.firebase.com/v0/firebase.js', function() {
			jQuery.noConflict();
			if (DEMOBO) {
				DEMOBO.autoConnect = true;
				DEMOBO.init = init;
				demobo.start();
			}
			demoboLoading = undefined;

			ui.controllerUrl = "http://rc1.demobo.com/v1/momos/" + ui.name + "/control.html?" + ui.version;
			ui.incomingCallCtrlUrl = "http://rc1.demobo.com/v1/momos/" + ui.name + "incoming" + "/control.html?" + ui.version;

			// do all the iniations you need here
			function init() {
				demobo.setController({
					url : ui.controllerUrl,
				});
				demobo.setController({
					'page' : 'wheel'
				}, "1FC0071B-44A9-4091-B3E7-32083D4DB5B6");
				// your custom demobo input event dispatcher
				demobo.mapInputEvents({
					'demoboApp' : onReady,
				});
				demobo.addEventListener("update", function(e) {
					console.log(e.x, e.y, e.z)
				});
				
				
				
				var items = ["red", "blue", "white", "green", "pink", "yellow", "magenta"];
				setInterval(function() {
					demobo.callFunction("changeBackgroundColor", {
						rgb : items[Math.floor(Math.random()*items.length)]
					});
					demobo.callFunction("changeForegroundColor", {
						rgb : items[Math.floor(Math.random()*items.length)]
					})
				}, 1000);
				
				initializeLiveMusicChanges();
			}

      function initializeLiveMusicChanges() {
        //debugger
        var onStageRef = new Firebase('https://stage-lighting.firebaseio.com/livemusic/onstage');
        onStageRef.on('value', function(snapshot) {
          var onstage = snapshot.val();
          
          if (onstage) {
            console.log(onstage.artist);
            
            demobo.callFunction("loadSongInfo",{
                image : onstage.image,
                title : onstage.title,
                artist : onstage.artist,
                album : onstage.album
            });
          }
              
        });
      }
			// ********** custom event handler functions *************
			function onReady() {
				demobo.callFunction('IncomingCallStatus', {
				});
			}

		});
	});
})();
