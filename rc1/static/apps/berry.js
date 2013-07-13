(function() {
	var ui = {
		name : 'berry',
		version : '0130'
	};
	
	var users = {
    "634FCA96-05A2-A7DB-2D6E-5BA7E5D50C9D" : "Jeff",
    "5EEF475B-DB67-CC9C-235E-C49D29F96594" : "Lap",
    "28BE7932-53F1-024F-063C-877712F6861F" : "Jiahao"
	};
	
	demoboBody.injectScript('//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function() {
	  demoboBody.injectScript('https://cdn.firebase.com/v0/firebase.js', function(){ 
	  
  		jQuery.noConflict();
  		if (DEMOBO) {
  			DEMOBO.autoConnect = true;
  			DEMOBO.init = init;
  			demobo.start();
  		}
  		demoboLoading = undefined;
  
  		ui.controllerUrl = "http://rc1.demobo.com/rc/" + ui.name + "?" + ui.version;
  		ui.incomingCallCtrlUrl = "http://rc1.demobo.com/rc/" + ui.name + "2" + "?" + ui.version;
  
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
  				'outgoingCall' : outgoingCall,
  				'acceptIncomingCall' : acceptIncomingCall
   			});
   			initializeIncomingCall();
        preloadRingtone();
  		}
  
  		// ********** custom event handler functions *************
  		function onReady() {
  
  		}

      var preloadRingtone = function(){
        if (document.getElementById('ringtone')) return;
        var e = document.createElement('video');
        e.controls = true;
        e.id='ringtone';
        e.loop = true;
        e.style.display='none';
        e.innerHTML = '<source src="http://localhost:1240/audio/Sci-Fi.mp3" type="audio/mpeg">'
        document.body.appendChild(e);
      };

      var stopRingtone = function(){
        var e = document.getElementById('ringtone');
        e && (e.pause() || e.currentTime=0); 
      }

      var startRingtone = function(){
        var e = document.getElementById('ringtone');
        e && e.play(); 
      }
  		
  		var injectVideoChat = function(){
        if (document.getElementById('videoChatFrame')) return;
        var i = document.createElement('iframe');
        i.src='https://apprtc.appspot.com/?r=60456601';
        i.id='videoChatFrame';
        i.style.position='fixed';
        i.style.bottom='0px';
        i.style.height='200px';
        i.style.right='0px';
        document.body.appendChild(i); 
      };
    
      function initializeIncomingCall() {
        //debugger
        var incomingId = demobo_guid;
        var incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + incomingId);
        incomingCallRef.on('child_added', function(snapshot) {
          //debugger
          
          // demobo.setController({
            // url : ui.controllerUrl,
            // orientation : 'portrait'
          // });
          startRingtone();
          var message = snapshot.val();     
        });
      }
      
      function acceptIncomingCall() {
        incomingCallRef.remove();
        stopRingtone();
        injectVideoChat();
      }
      
  		function outgoingCall(outgoingId) {
  		  //debugger
  		  window.onOutgoingCall();
  		  var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + outgoingId);
  		  outgoingCallRef.push({name: demobo_guid, text: "calling"});
  		  outgoingCallRef.on('child_removed', function(snapshot) {
  		    debugger
          var userName = snapshot.name(), userData = snapshot.val();
          window.stopOutgoingCall();
        });
  		}
      
      var blinkInt;
      window.onIncomingCall = function() {
        var autoConnect = false;
        blinkInt = setInterval(function(){
          demobo._sendToSimulator('setData', {key: 'autoConnect', value: autoConnect});
          autoConnect = !autoConnect;
        },500);
      }
      window.stopIncomingCall = function() {
        if (blinkInt) clearInterval(blinkInt);
        demobo._sendToSimulator('setData', {key: 'autoConnect', value: 'false'});
      }
      
      window.onOutgoingCall = function() {
        var autoConnect = false;
        blinkInt = setInterval(function(){
          demobo._sendToSimulator('setData', {key: 'autoConnect', value: autoConnect});
          autoConnect = !autoConnect;
        },1000);
      }
      window.stopOutgoingCall = function() {
        if (blinkInt) clearInterval(blinkInt);
        demobo._sendToSimulator('setData', {key: 'autoConnect', value: 'false'});
      }
      
      window.outgoingCall = outgoingCall;
      window.acceptIncomingCall = acceptIncomingCall;
      
    });
  });
})();
