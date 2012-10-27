function loadMain() {
	var s = document.createElement('script');
	var domain = demobo.getCurrentDomain();
	var base = 'http://rc1.demobo.com/apps/';

	switch (domain) {
	// when we support more websites, add new cases here;
	case '8tracks.com':
	case 'rdio.com':
	case 'pandora.com':
	case 'facebook.com':
	case 'douban.fm':
	case 'last.fm':
	case 'play.google.com':
	case 'grooveshark.com':
		s.src = base + domain + '.js?0930';
		break;
	default:
		s.src = base + 'pandora.com.js';
		break;
	}
	s.setAttribute('class', 'dmb-script');
	document.getElementById('demoboBody').appendChild(s);
}

function loadDemoboApi() {
	var s = document.createElement('script');
	s.src = 'http://api.demobo.com/demobo.1.1.min.js';
	s.setAttribute('class', 'dmb-script');
	s.onload = loadMain;
	document.getElementById('demoboBody').appendChild(s);
}

function showDemobo() {
	var temp = document.getElementById('demoboCover');
	if (temp) {
		temp.style.display='block';
		demobo.showQR();
		return;
	}
	var id = 'demoboCover';
	var demoboCover = document.createElement('div');
	demoboCover.setAttribute('id', 'demoboCover');
	document.getElementById('demoboBody').appendChild(demoboCover);

	var demoboCoverDiv = document.createElement("div");
	demoboCoverDiv.setAttribute('id', 'demoboCoverDiv');
	demoboCover.appendChild(demoboCoverDiv);

	var div = document.createElement("div");
	div.setAttribute('id', 'demoboClose');
	demoboCoverDiv.appendChild(div);
	var a = document.createElement("a");
	a.setAttribute("onclick", "hideDemobo();");
	newContent = document.createTextNode('✕');
	a.appendChild(newContent);
	div.appendChild(a);
	
	if (demobo.getState()!=1) {
		var div = document.createElement("div");
		div.appendChild(document.createTextNode('Failed to connect with de Mobo:'));
		demoboCoverDiv.appendChild(div);
		var div = document.createElement("div");
		div.appendChild(document.createTextNode('Unable to connect to the server. If you have a firewall, it may be blocking the connection.'));
		demoboCoverDiv.appendChild(div);
		demoboCover.style.opacity = 1;
	} else {
		var div = document.createElement("div");
		div.setAttribute('id','settings');
		var label = document.createElement("label");
		label.setAttribute("class","info");
		label.setAttribute("for","alwaysOnCheckbox");
		label.setAttribute("onclick","");
		label.appendChild(document.createTextNode('AUTO CONNECT'));
		div.appendChild(label);
		var ul = document.createElement("ul");
		ul.setAttribute("id","checked");
		div.appendChild(ul);
		var li = document.createElement("li");
		ul.appendChild(li);
		var p = document.createElement("p");
		li.appendChild(p);
		var alwaysOn = document.createElement("input");
		alwaysOn.id = "alwaysOnCheckbox";
		alwaysOn.type = "checkbox";
		alwaysOn.name = "alwaysOnCheckbox";
		p.appendChild(alwaysOn);
		var label = document.createElement("label");
		label.setAttribute("class","check");
		label.setAttribute("for","alwaysOnCheckbox");
		label.setAttribute("onclick","");
		p.appendChild(label);
		
		demoboCoverDiv.appendChild(div);
		alwaysOn.checked = localStorage.isAutoLoad;
		var OnChangeCheckbox = function() {
			localStorage.isAutoLoad = alwaysOn.checked?"true":"";
		};
		alwaysOn.addEventListener ("click", OnChangeCheckbox, false);
		
		demobo.renderQR('demoboCoverDiv', 1);
		var temp = document.querySelector('#demoboCoverDiv > img');
		
		var iframe = document.createElement("iframe");
		iframe.setAttribute('id','demoboHelpPage');
		iframe.src = "http://rc1.demobo.com/help.html?"+demobo.getCurrentDomain()+'_2.17';		
		demoboCoverDiv.appendChild(iframe);
		iframe.onload = function() {
			demoboCover.style.opacity = 1;
		};
	}
}

function hideDemobo() {
	var temp = document.getElementById('demoboCover');
	if (temp) {
		temp.style.display='none';
		demobo.hideQR();
	}
}

function toggleDemobo() {
	var temp = document.getElementById('demoboCover');
	if (temp && temp.style.display!='none') {
		hideDemobo();
	} else {
		showDemobo();
	}
	demobo.setController();
}

//if another demobo is loading, do nothing
if (typeof demoboLoading == 'undefined') {
	// toggle demobo
	if (typeof demoboOn != 'undefined') {
		toggleDemobo();
	} else {
		demoboLoading = 1;
		demoboOn = 1;
		var e = document.createElement('div');
		e.setAttribute('id', 'qrcode');
		document.getElementById('demoboBody').appendChild(e);
		loadDemoboApi();
	}
}