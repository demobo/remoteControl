(function() {
	var dev = true;
	var injectedExtScript;
	if (dev) {
		injectedExtScript = function() {
			window.demoboRcPort = 1240;
			window.demoboPort = 1240;
			demoboBody.extScriptUrl = 'http://localhost:'+window.demoboRcPort+'/core/berry-ext.js';
		};
	} else {
		injectedExtScript = function() {
			demoboBody.extScriptUrl = '//rc1-dot-de-mobo.appspot.com/core/berry-ext.js';
		};
	}
	var injectedScript = function() {
		demoboBody.injectScript = function(url,callback) {
			var s = document.createElement('script');
			s.src = url;
			s.setAttribute('class', 'dmb-script');
			s.onload = function() {
				if (callback) callback();
			    this.parentNode.removeChild(this);
			};
			(document.head||document.documentElement).appendChild(s);
		};
		demoboToggle.onclick = function() {
			if (typeof toggleDemobo != 'undefined') {
				toggleDemobo();
			} else {
				demoboBody.injectScript(demoboBody.extScriptUrl);
			}
		};
		demoboBody.addEventListener("FromContentScript", function(e) {
			demoboBody.detail = e.detail;
		});
		demoboBody.addEventListener("connectDemobo", function(e) {
			demobo.connect();
		});
		demoboBody.addEventListener("disconnectDemobo", function(e) {
			demobo.disconnect();
		});
		demoboBody.addEventListener("FromPopup", function(e) {
			if (e.detail && e.detail.type) {
				demobo._message({data: JSON.stringify(e.detail)});
			}
		});
	};
	
	if (!document.getElementById('demoboToggle')) {
		var demoboToggle = document.createElement('div');
		demoboToggle.setAttribute('id', 'demoboToggle');
		var demoboBody = document.createElement('div');
		demoboBody.setAttribute('id', 'demoboBody');
		document.body.appendChild(demoboBody);
		demoboBody.appendChild(demoboToggle);
		injectJavascript(injectedExtScript);
		injectJavascript(injectedScript);
		
		chrome.extension.onMessage.addListener(onMessage);
		demoboBody.addEventListener("FromFrontground", function(e) {
			chrome.extension.sendMessage({action:'FromFrontground', detail: e.detail});
		});

		var timeToWait = 3000;
		if (!localStorage.isDemobo) localStorage.isAutoLoad = "true";
		setTimeout(pageActionOnClick, timeToWait + 1000);
	}
	
	function onMessage(message, sender, sendResponse) {
		if (message.action == 'toggleDemobo') {
			pageActionOnClick();
		} else if (message.action == 'ping') {
			if (message.extesionDetail) sendToFrontPage("FromContentScript", message.extesionDetail);
			sendResponse({active: true});
		} else if (message.action == 'FromPopup') {
			if (message.detail) sendToFrontPage("FromPopup", message.detail);
			sendResponse({active: true});
		} else if (message.action == 'connectDemobo') {
			sendToFrontPage("connectDemobo");
		} else if (message.action == 'disconnectDemobo') {
			sendToFrontPage("disconnectDemobo");
		}
	}
	function sendToFrontPage(evtName, evtDetail) {
		var evt = new CustomEvent(evtName, {detail: evtDetail});
		demoboBody.dispatchEvent(evt);
	}
	function javascriptToString(f) {
		var args = [];
		for ( var i = 1; i < arguments.length; ++i) {
			args.push(JSON.stringify(arguments[i]));
		}
		return "(" + f.toString() + ")(" + args.join(",") + ");";
	}
	function injectJavascript(f) {
		var actualCode = javascriptToString(f);
		var script = document.createElement('script');
		script.textContent = actualCode;
		(document.head||document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);
	}
	function pageActionOnClick() {
		// content script only has access to dom object in front page, here is a hack
		document.getElementById('demoboToggle').click();
	}
})();
