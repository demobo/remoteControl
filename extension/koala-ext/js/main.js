var dev = true;
//change these two lines for loading local files
var appEnginePort = 1250;
var injectedScript = function() {
	demoboBody.injectScript = function(url, callback) {
		var s = document.createElement('script');
		s.src = url;
		s.setAttribute('class', 'dmb-script');
		s.onload = function() {
			if (callback)
				callback();
			this.parentNode.removeChild(this);
		};
		(document.head || document.documentElement).appendChild(s);
	};
	demoboBody.addEventListener("FromContentScript", function(e) {
		demoboBody.detail = e.detail;
	});
	demoboBody.addEventListener("FromPopup", function(e) {
		console.log(e.detail);
		if (e.detail && e.detail.type) {
			demobo._message({
				data : JSON.stringify(e.detail)
			});
		}
	});
};
if (!document.getElementById('toggle')) {
	var demoboBody = document.createElement('div');
	demoboBody.setAttribute('id', 'demoboBody');
	document.body.appendChild(demoboBody);
	var toggle = document.createElement('div');
	if (dev) {
		toggle.setAttribute('onclick', 'javascript:((function(c){(c.demoboPortal&&c.demoboPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e=(document.location.protocol==="https:")?"https://localhost:443":"http://localhost:' + appEnginePort + '";window.demoboBase=e;b.src=e+"/core/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
	} else {
		toggle.setAttribute('onclick', 'javascript:((function(c){(c.demoboPortal&&c.demoboPortal.set("mode","EXTENSION"));c._extension=1;var d=window.__dmtg;((!c.demoboPortal&&function(){var a=new Date,b=c.document.createElement("script"),e="//d1hew6xzj9n4kw.cloudfront.net";window.demoboBase=e;b.src="//d32q09dnclw46p.cloudfront.net/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)})||d)()})(window))');
	}
	toggle.setAttribute('id', 'toggle');
	document.body.appendChild(toggle);

	var load = document.createElement('div');
	load.setAttribute('id', 'load');
	load.setAttribute('onclick', 'javascript:(function(c){(c.demoboPortal&&c.demoboPortal.set("mode","EXTENSION"));!c.demoboPortal&&(function(){c._extension=1;var a=new Date,b=c.document.createElement("script"),e="//d1hew6xzj9n4kw.cloudfront.net";window.demoboBase=e;b.src="//d32q09dnclw46p.cloudfront.net/entry.js?"+a.getTime();b.className="demoboJS";c.document.body&&c.document.body.appendChild(b)}());})(window)');
	//  load.setAttribute('onclick', 'javascript:(function(){if (window.demobo)return;document.getElementById("toggle").click()})()');
	document.body.appendChild(load);

	injectJavascript(injectedScript);

	function onMessage(message, sender, sendResponse) {
		console.log(message.action);
		if (message.action === 'toggleKoala') {
			document.getElementById('toggle').click();
			//favicon off message
		} else if (message.action === 'load') {
			document.getElementById('load').click();
			var detail = {type:"input", source:'demoboApp',value:'',userName:"simulator",deviceID:"simulator"};
			sendToFrontPage("FromPopup",detail);
		} else if (message.action == 'FromPopup') {
			if (message.detail)
				sendToFrontPage("FromPopup", message.detail);
			sendResponse({
				active : true
			});
		}

	};
	function sendToFrontPage(evtName, evtDetail) {
		var evt = new CustomEvent(evtName, {
			detail : evtDetail
		});
		demoboBody.dispatchEvent(evt);
	}

	function javascriptToString(f) {
		var args = [];
		for (var i = 1; i < arguments.length; ++i) {
			args.push(JSON.stringify(arguments[i]));
		}
		return "(" + f.toString() + ")(" + args.join(",") + ");";
	}

	function injectJavascript(f) {
		var actualCode = javascriptToString(f);
		var script = document.createElement('script');
		script.textContent = actualCode;
		(document.head || document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);
	}


	chrome.extension.onMessage.addListener(onMessage);
	//  toggle.click();
}
