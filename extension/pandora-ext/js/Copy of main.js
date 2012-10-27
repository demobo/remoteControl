(function() {
	var dev = false;//change these two lines for loading local files
	var devPort = 1242;
	
	if (!document.getElementById('demoboToggle')){
	  var demoboToggle = document.createElement('div');
	  if (dev){
		  demoboToggle.setAttribute('onclick', "javascript:(function(){if(typeof toggleDemobo!='undefined'){toggleDemobo();}else{var s = document.createElement('script');window.demoboRcPort = "+devPort+";window.demoboPort = "+devPort+";s.src='http://localhost:"+devPort+"/dev/demobo-ext.js';document.getElementById('demoboBody').appendChild(s);}}())");
	  }else{
		  demoboToggle.setAttribute('onclick', "javascript:(function(){if(typeof toggleDemobo!='undefined'){toggleDemobo();}else{var s = document.createElement('script');s.src = 'http://rc1.demobo.com/core/demobo-ext-3.js?0919'; document.getElementById('demoboBody').appendChild(s);}}())");
	  }
	  demoboToggle.setAttribute('id', 'demoboToggle');
	  
	  var demoboBody = document.createElement('div');
	  demoboBody.setAttribute('id', 'demoboBody');
	  document.body.appendChild(demoboBody);
	  demoboBody.appendChild(demoboToggle);
	  
	  function onMessage(message, sender, sendResponse) {
		  if (message=='toggleDemobo'){
			  document.getElementById('demoboToggle').click();
		  } else if (message=='ping') {
			  chrome.extension.sendMessage('pingback');
		  }
		  sendResponse({});
	  };
	  
	  chrome.extension.onMessage.addListener(onMessage);
	  
	  
	  var timeToWait = 1000; //in case sometimes you wanna wait for the page to load, you can definitely set it to 0;  
	  if (!localStorage.isDemobo) localStorage.isAutoLoad = "true";
	  //this tag indicates whether you want the extension to load demobo automatically or after user clicks icon
	  if(localStorage.isAutoLoad){
		  setTimeout(function(){document.getElementById('demoboToggle').click();},timeToWait+1000);
	  }
	}
})();