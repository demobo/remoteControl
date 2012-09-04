DEMOBO_DEV_RC = "http://localhost:1280";
DEMOBO_PROD_RC = "http://rc1.demobo.com";
DEMOBO_API = 'http://api.demobo.com/js_demobo.js';
var dev = true;

function getSuportedSites() {
	return [ 'pandora.com', 'last.fm','grooveshark.com','douban.fm'];
}

function isSupportedSite() {
	var domain = getCurrentDomain();
	return (getSuportedSites().indexOf(domain) >=0);
}

function isDemoboSupported() {
	return isSupportedSite();
}
function getCurrentDomain() {
	return document.domain ? document.domain : window.location.hostname;
}

function loadMain() {
	if (!isDemoboSupported()) return;
	console.log('loading Main');
	var s = document.createElement('script');

	console.log('before domain');
	console.log(typeof getCurrentDomain);
	var domain = getCurrentDomain();
	console.log('after domain called');
	var base;
	if (dev) {
		base = DEMOBO_DEV_RC+'/apps/';
	} else {
		base = DEMOBO_PROD_RC+'/apps/';
	}
	console.log('the domain is: ' + domain);
	if (isSupportedSite()) {
		s.src = base + domain + '.js?1';
	} else {
		s.src = base + 'default-main.js';
	}
	s.setAttribute('class', 'dmb-script');
	document.body.appendChild(s);
}

//util.js should have utility functions for developer. An alternative is to pack these utilities into js_all.js so that we dont needa import util.jss
function loadUtil(){
  console.log('loading Util');
  var s = document.createElement('script');
  s.src = dev?DEMOBO_DEV_RC+'/dev/util.js?1':DEMOBO_PROD_RC+'/dev/util.js?1';
  s.setAttribute('class', 'dmb-script');
  s.onload = loadMain;
  document.body.appendChild(s);
}

function loadDemoboApi() {
	console.log('loading DemoboApi');
	var s = document.createElement('script');
	s.src = DEMOBO_API;
	s.setAttribute('class', 'dmb-script');
	s.onload = loadUtil;
	document.body.appendChild(s);
}

function toggleExtension() {
	// if another demobo is loading, do nothing
	console.log('loading extension');
	if (!localStorage.getItem('demoboExtLoading')) {
		// toggle demobo
		if (!!localStorage.getItem('demoboExtOn')) {
			document.getElementById('setController').click();
		} else {
			localStorage.setItem('demoboExtLoading', 1);
			localStorage.setItem('demoboExtOn', 1);
			var e = document.createElement('div');
			e.setAttribute('id', 'qrcode');
			document.body.appendChild(e);

			var setController = document.createElement('div');
			setController.setAttribute('onclick', 'javascript:setDemoboController();');
			setController.setAttribute('id', 'setController');
			document.body.appendChild(setController);

      var toggleDemobo = document.createElement('div') ;
      toggleDemobo.setAttribute('onclick', 'javascript:toggleDemobo();');
      toggleDemobo.setAttribute('id', 'toggleDemobo');
      document.body.appendChild(toggleDemobo);
			loadDemoboApi();
		}
	}
}

function onMessage(message, sender, sendResponse) {
  console.log('here at front end: '+message);
 if (message=='toggleDemobo'){
    console.log(message);
    document.getElementById('toggleDemobo').click();
    sendResponse({});
  }
};

chrome.extension.onMessage.addListener(onMessage);
chrome.extension.sendMessage('testing sendMessage');

localStorage.clear();
toggleExtension();
