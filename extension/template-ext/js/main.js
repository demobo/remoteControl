if (!document.getElementById('toggle')){
  var toggle = document.createElement('div');
  toggle.setAttribute('onclick', "javascript:(function(){if(typeof toggleDemobo!='undefined'){toggleDemobo();}else{var s = document.createElement('script');s.src = 'http://rc1.demobo.com/core/demobo-ext.js?123'; document.body.appendChild(s);}}())");
  toggle.setAttribute('id', 'toggle');
  document.body.appendChild(toggle);
  
  function onMessage(message, sender, sendResponse) {
    console.log('here at front end: '+message);
   if (message=='toggleDemobo'){
      console.log(message);
  //    document.getElementById('toggleDemobo').click();
      document.getElementById('toggle').click();
      sendResponse({});
    }
  };
  
  chrome.extension.onMessage.addListener(onMessage);
  
  
  var timeToWait = 0; //in case sometimes you wanna wait for the page to load, you can definitely set it to 0;
  setTimeout(function(){chrome.extension.sendMessage('testing sendMessage');},timeToWait);
  
  var autoLoad = false; //this tag indicates whether you want the extension to load demobo automatically or after user clicks icon
  if(autoLoad){
    toggle.click();
  }
}
