(function() {
	var ui = {
		name : 'youtube',
		version : '0130'
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
  				'outgoingCall' : outgoingCall
   			});
   			
   			initializeIncomingCall();
   			
   			injectVideoChat();  			
  		}
  
  		// ********** custom event handler functions *************
  		function onReady() {
  
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
        var incomingId = demobo_guid;
        var incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + incomingId);
        incomingCallRef.on('child_added', function(snapshot) {
          var message = snapshot.val();
          displayChatMessage(message.name, message.text);
        });
      }
      
  		function outgoingCall(outgoingId) {
  		  var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + outgoingId);
  		  outgoingCallRef.push({name: demobo_guid, text: "calling"});
  		}
  
      function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };
      
    });
  });
})();
