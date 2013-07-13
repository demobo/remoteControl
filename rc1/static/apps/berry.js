(function() {
	var ui = {
		name : 'berry',
		version : '0710'
	};
	
	var users = {
    "634FCA96-05A2-A7DB-2D6E-5BA7E5D50C9D" : "Jeff",
    "5EEF475B-DB67-CC9C-235E-C49D29F96594" : "Lap",
    "28BE7932-53F1-024F-063C-877712F6861F" : "Jiahao",
    "C116FD42-F2B5-EE59-17A6-78F40F22221F" : "Shawn"
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
  				'declineIncomingCall' : declineIncomingCall,
  				'gotoUrl' : gotoUrl
   			});
   			initializeIncomingCall();
        preloadRingtone();
  		}
  
  		// ********** custom event handler functions *************
  		function onReady() {
  			var callerId = window.call.val()['name'];
  			var caller = users[callerId];
  			demobo.callFunction('IncomingCallStatus', {
  				fromPerson: caller,
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
        e.innerHTML = '<source src="//rc1-dot-de-mobo.appspot.com/audio/Sci-Fi.mp3" type="audio/mpeg">'
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
          e.style.zIndex= '999';
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
          window.call = snapshot;     
        });
        
        var shareWebPageRef = new Firebase('https://de-berry.firebaseio-demo.com/webpage');
        shareWebPageRef.on('child_added', function(snapshot){
          var url = snapshot.val()['url'];
          openURL(url);
        });
      }
      
      function gotoUrl(url) {
        var shareWebPageRef = new Firebase('https://de-berry.firebaseio-demo.com/webpage');
        shareWebPageRef.push({name: demobo_guid, url: url });
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
        
        debugger
        if (window.call.val()['callinglist'].length > 1) {
          jQuery.each(window.call.val()['callinglist'], function(index, value){
            if (value !== demobo_guid) {
              debugger
              var groupOutgoingId = value;
              outgoingCall(groupOutgoingId);  
            }
          });
        }
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
          var callerId = snapshot.val()['name'];
          if (callerId === demobo_guid) {
            injectVideoChat(snapshot.name());
          }
          window.stopOutgoingCall();
          
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
        if (document.getElementById('berryFrame')){
          document.getElementById('berryFrame').src=url;
          return;
        }
      	var e = document.createElement('iframe');
      	e.src=url;
        e.id='berryFrame';
      	e.style.position = 'absolute';
      	e.style.height = '100%';
      	e.style.width = '100%';
        e.style.left = '0px';
        e.style.border='none';
        e.style.top = '0px';
      	deleteWebContent();
      	document.body.appendChild(e);
      };
      
      var deleteWebContent = function(){
      	var parent = document.body;
      	var children = parent.childNodes;
        var l = children.length;
      	var i=0;
      	while (i<l){
          if (children[0].id === 'demoboBody'){
            return;
          }
      		parent.removeChild(children[0]);
      		i = i+1;	
      	}
      };
      
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
      window.openURL = openURL;
      window.injectVideoChat = injectVideoChat;
    });
  });
})();
