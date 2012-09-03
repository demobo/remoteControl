function loadMain() {
	console.log('util loaded, here at loadMain');
	var s = document.createElement('script');

	var domain = getCurrentDomain();
	var base;
	if (dev) {
		// assume localhost:1238 is the test environment, which is set in Google
		// AppEngine
		base = 'http://localhost:1238/';
	} else {
		base = 'http://rc1.demobo.com/apps/';
	}
	switch (domain) {
	// when we support more websites, add new cases here;
	case 'pandora.com':
	case 'facebook.com':
	case 'douban.fm':
	case 'last.fm':
  case 'play.google.com':
  case 'grooveshark.com':
		s.src = base + 'apps/' + domain + '.js?1sl';
		break;
	default:
		s.src = base + 'apps/' + 'default-main.js';
		break;
	}
	s.setAttribute('class', 'dmb-script');
	document.body.appendChild(s);
}

// util.js should have utility functions for developer. An alternative is to
// pack these utilities into js_all.js so that we dont needa import util.jss
function loadUtil() {
	console.log('DemoboApi loaded, here at loadUtil');
	var s = document.createElement('script');
	s.src = dev ? 'http://localhost:1238/util.js'
			: 'http://rc1.demobo.com/core/util.js?1211';
	s.setAttribute('class', 'dmb-script');
	s.onload = loadMain;
	document.body.appendChild(s);
}

function loadDemoboApi() {
	console.log('jquery loaded, here at loadDemoboApi');
	var s = document.createElement('script');
	s.src = dev ? 'http://api.demobo.com/js_demobo.js'
			: 'http://api.demobo.com/js_demobo.js';
	s.setAttribute('class', 'dmb-script');
	s.onload = loadUtil;
	document.body.appendChild(s);
}

// for development. comment out if it is not for dev
var dev = false;

// if another demobo is loading, do nothing
if (typeof demoboLoading == 'undefined') {
	// toggle demobo
	if (typeof demoboOn != 'undefined') {
		setDemoboController();
	} else {
		demoboLoading = 1;
		demoboOn = 1;
		var e = document.createElement('div');
		e.setAttribute('id', 'qrcode');
		document.body.appendChild(e);
		loadDemoboApi();
	}
}
