var dev = true;//change these two lines for loading local files
var appEnginePort = 1240;
if (!document.getElementById('toggle')){
  var toggle = document.createElement('div');
  if (dev){
    toggle.setAttribute('onclick', 'javascript:((function(c){var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e=(document.location.protocol==="https:")?"https://localhost:443":"http://localhost:'+appEnginePort+'";window.demoboBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
  }else{
    toggle.setAttribute('onclick', 'javascript:((function(c){var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e="//d1hew6xzj9n4kw.cloudfront.net";window.demoboBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))'); 
  }
  toggle.setAttribute('id', 'toggle');
  document.body.appendChild(toggle);
  
  function onMessage(message, sender, sendResponse) {
   if (message.action === 'toggleDemobo'){
  //    document.getElementById('toggleDemobo').click();
      document.getElementById('toggle').click();
    }
  };
  
  chrome.extension.onMessage.addListener(onMessage);
  toggle.click();
}
