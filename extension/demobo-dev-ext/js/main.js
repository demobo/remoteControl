var dev = true;//change these two lines for loading local files
var appEnginePort = 1240;

//modifiy addBobos if you wanna add bobos to the existing bobos
var addBobos = {
  	// '.*':['https://localhost:443/v1/bobos/docs.google.com-new.js']
  	'.*':['http://localhost:1240/v1/bobos/communicationtool.js']
  }; 

//modify setBobos if you wanna replace the existing bobos
var setBobos = {
}

if (!document.getElementById('toggle')){
  var toggle = document.createElement('div');
  if (dev){
    toggle.setAttribute('onclick', 'javascript:((function(c){c.demoboAddBobos='+JSON.stringify(addBobos)+';c._extension=1;var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e=(document.location.protocol==="https:")?"https://localhost:443":"http://localhost:'+appEnginePort+'";window.demoboBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
  }else{
    toggle.setAttribute('onclick', 'javascript:((function(c){c.demoboAddBobos='+JSON.stringify(addBobos)+';c._extension=1;var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e="//d1hew6xzj9n4kw.cloudfront.net";window.demoboBase=e;b.src="//d32q09dnclw46p.cloudfront.net/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))'); 
  }
  toggle.setAttribute('id', 'toggle');
  document.body.appendChild(toggle);

  var load = document.createElement('div');
  load.setAttribute('id', 'load');
  load.setAttribute('onclick', 'javascript:(function(){if (window.demobo)return;document.getElementById("toggle").click()})()');
  document.body.appendChild(load);

  function onMessage(message, sender, sendResponse) {
   if (message.action === 'toggleDemobo'){
  //    document.getElementById('toggleDemobo').click();
      document.getElementById('toggle').click();

   //favicon off message
   }else if(message.action === 'load'){
     console.log('hello');
     document.getElementById('load').click();
   }

  };
  
  chrome.extension.onMessage.addListener(onMessage);
//  toggle.click();
}
