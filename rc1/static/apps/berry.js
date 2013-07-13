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
	
	var call = {
	  
	};
	
	var callingList = [
	];
	
	demoboBody.injectScript('//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function() {
	  demoboBody.injectScript('https://cdn.firebase.com/v0/firebase.js', function() { 
	  
  		jQuery.noConflict();
  		if (DEMOBO) {
  			DEMOBO.autoConnect = true;
  			DEMOBO.init = init;
  			demobo.start();
  		}
  		demoboLoading = undefined;
  
  		ui.controllerUrl = "http://rc1.demobo.com/rc/" + ui.name + "?" + ui.version;
  		ui.incomingCallCtrlUrl = "http://rc1.demobo.com/rc/" + ui.name + "incoming" + "?" + ui.version;
  
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
  				'acceptIncomingCall' : acceptIncomingCall,
  				'declineIncomingCall' : declineIncomingCall
   			});
   			initializeIncomingCall();
        preloadRingtone();
  		}
  
  		// ********** custom event handler functions *************
  		function onReady() {
  			demobo.callFunction('IncomingCallStatus', {
  				fromPerson: 'JAAA',
  				fromSocial: "Facebook"
  			});
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
        e && (e.pause() || (e.currentTime=0)); 
      }

      var startRingtone = function(){
        var e = document.getElementById('ringtone');
        e && e.play(); 
      }
  		
  		// var injectVideoChat = function(roomId){
        // if (document.getElementById('videoChatFrame')) return;
        // var i = document.createElement('iframe');
        // i.src='https://apprtc.appspot.com/?r=' + roomId;
        // i.id='videoChatFrame';
        // i.style.position='fixed';
        // i.style.bottom='0px';
        // i.style.height='200px';
        // i.style.right='0px';
        // document.body.appendChild(i); 
      // };

  		var injectVideoChat = function(roomId){
        if (!document.getElementById('chatContainer')){
          var e = document.createElement('div');
          e.id='chatContainer';
          e.style.position='fixed';
          e.style.bottom='0px';
          e.style.right='0px';
          document.body.appendChild(e); 
        }
        var i = document.createElement('iframe');
        i.src='https://apprtc.appspot.com/?r=' + roomId;
        i.className='videoChatFrame';
        i.id=roomId;
        i.style.width='200px';
        document.getElementById('chatContainer').appendChild(i);
      };

    
      function initializeIncomingCall() {
        //debugger
        var incomingId = demobo_guid;
        var incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + incomingId);
        incomingCallRef.on('child_added', function(snapshot) {
          //debugger
          
          demobo.setController({
            url : ui.incomingCallCtrlUrl,
            orientation : 'portrait'
          });
          
          startRingtone();
          window.onIncomingCall();
          debugger
          if (snapshot.val()['callinglist'].length > 1) {
            var groupOutgoingId = snapshot.val()['callinglist'][1];
            outgoingCall(groupOutgoingId);
          }
            
          window.call = snapshot;     
        });
      }
      
      function acceptIncomingCall() {
        demobo.setController({
          url : ui.controllerUrl,
          orientation : 'portrait'
        });

        var incomingId = demobo_guid;
        var incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + incomingId);
        
        //debugger
        incomingCallRef.remove();
        window.stopIncomingCall();
        stopRingtone();
        var roomId = window.call.name();
        injectVideoChat(roomId);
      }
      
      function declineIncomingCall() {
        demobo.setController({
          url : ui.controllerUrl,
          orientation : 'portrait'
        });
        
        var incomingId = demobo_guid;
        var incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + incomingId);
        //debugger
        incomingCallRef.remove();
        window.stopIncomingCall();
        stopRingtone();
        //injectVideoChat();
      }
      
  		function outgoingCall(outgoingId) {
  		  //debugger
  		  callingList.push(outgoingId);
  		  window.onOutgoingCall();
  		  var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + outgoingId);
        outgoingCallRef.push({name: demobo_guid, callinglist: callingList });
      
        outgoingCallRef.on('child_removed', function(snapshot) {
          //debugger
          //var userName = snapshot.name(), userData = snapshot.val();
          window.stopOutgoingCall();
          injectVideoChat(snapshot.name());
        });
          
  		  // jQuery.each(callingList, function(index, value) {
  		    // debugger
          // var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + value);
          // outgoingCallRef.push({name: demobo_guid, callinglist: callingList });
//         
          // outgoingCallRef.on('child_removed', function(snapshot) {
            // //debugger
            // //var userName = snapshot.name(), userData = snapshot.val();
            // window.stopOutgoingCall();
            // injectVideoChat(snapshot.name());
          // });
        // });
  		}
      
      var openURL = function(url){
      	var e = document.createElement('iframe');
      	e.src=url;
      	deleteWebContent();
      	document.body.appendChild(e);
      };
      
      var deleteWebContent = function(){
      	var parent = document.body;
      	var children = parent.childNodes;
      	for (i = 0; i+=1; i<children.length-2){
      		parent.removeChild(children[i]);	
      	}
      }
      
      var incomingBlinkInt;
      window.onIncomingCall = function() {
        var autoConnect = false;
        incomingBlinkInt = setInterval(function(){
          demobo._sendToSimulator('setData', {key: 'autoConnect', value: autoConnect});
          autoConnect = !autoConnect;
        },500);
      }
      window.stopIncomingCall = function() {
        if (incomingBlinkInt) clearInterval(incomingBlinkInt);
        demobo._sendToSimulator('setData', {key: 'autoConnect', value: 'false'});
      }
      
      var outgoingBlinkInt;
      window.onOutgoingCall = function() {
        var autoConnect = false;
        outgoingBlinkInt = setInterval(function(){
          demobo._sendToSimulator('setData', {key: 'autoConnect', value: autoConnect});
          autoConnect = !autoConnect;
        },1000);
      }
      window.stopOutgoingCall = function() {
        if (outgoingBlinkInt) clearInterval(outgoingBlinkInt);
        demobo._sendToSimulator('setData', {key: 'autoConnect', value: 'false'});
      }
      
      window.outgoingCall = outgoingCall;
      window.acceptIncomingCall = acceptIncomingCall;
      window.call = call;
      window.deleteWebContent = deleteWebContent;
    });
  });
})();
