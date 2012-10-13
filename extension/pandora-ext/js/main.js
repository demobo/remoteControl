var dev = false;//change these two lines for loading local files
var devPort = 1242;

if (!document.getElementById('toggle')){
  var toggle = document.createElement('div');
  if (dev){
    toggle.setAttribute('onclick', "javascript:(function(){if(typeof toggleDemobo!='undefined'){toggleDemobo();}else{var s = document.createElement('script');window.demoboRcPort = "+devPort+";window.demoboPort = "+devPort+";s.src='http://localhost:"+devPort+"/dev/demobo-ext.js';document.body.appendChild(s);}}())");
  }else{
    toggle.setAttribute('onclick', "javascript:(function(){if(typeof toggleDemobo!='undefined'){toggleDemobo();}else{var s = document.createElement('script');s.src = 'http://rc1.demobo.com/core/demobo-ext.js?0919'; document.body.appendChild(s);}}())");
  }
  toggle.setAttribute('id', 'toggle');
  document.body.appendChild(toggle);
  
  function onMessage(message, sender, sendResponse) {
    console.log('here at front end: '+message);
   if (message=='toggleDemobo'){
      console.log(message);
      document.getElementById('toggle').click();
      sendResponse({});
    }
  };
  
  chrome.extension.onMessage.addListener(onMessage);
  
  
  var timeToWait = 3000; //in case sometimes you wanna wait for the page to load, you can definitely set it to 0;
  setTimeout(function(){chrome.extension.sendMessage('testing sendMessage');},timeToWait);
  
  if (!localStorage.isDemobo) localStorage.isAutoLoad = "true";
  //this tag indicates whether you want the extension to load demobo automatically or after user clicks icon
  if(localStorage.isAutoLoad){
	  setTimeout(function(){toggle.click();},timeToWait+1000);
  }
}
