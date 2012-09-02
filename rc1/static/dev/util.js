function showDemobo() {
	var id = 'demoboCover';
	var demoboCover = document.createElement('div');
	demoboCover.setAttribute('id', id);
	demoboCover.style.zIndex = '9999';
	demoboCover.style.textAlign = 'center';
	demoboCover.style.position = 'fixed';
	demoboCover.style.width = '100%';
	demoboCover.style.height = '100%';
	demoboCover.style.top = '0';
	demoboCover.style.left = '0';
	demoboCover.style.backgroundColor = 'rgba(255,255,255,0.5)';
	demoboCover.style.color = 'black';
	demoboCover.style.fontSize = '30px';

	document.body.appendChild(demoboCover);

	demobo.renderQR(id, 1);
	var temp = document.querySelector('#'+id+' > img');
	temp.style.position = 'relative';
	temp.style.margin = '100px 0px 50px 0px';
	
	var div = document.createElement("div");
	div.style.width="50%";
	div.style.margin="auto";
	newContent = document.createTextNode('We are almost there. Download "de Mobo" and pair with this browser using this QR code.');
	div.appendChild(newContent);
	document.getElementById(id).appendChild(div);
	
	var div = document.createElement("div");
	document.getElementById(id).appendChild(div);
	var a = document.createElement("a");
	a.href = "http://itunes.apple.com/us/app/de-mobo/id519605488?ls=1&mt=8";
	a.target = "_blank";
	div.appendChild(a);
	var img = document.createElement("img");
	img.src = "http://www.demobo.com/app_store.png";
	a.appendChild(img);
	
	var div = document.createElement("div");
	document.getElementById(id).appendChild(div);
	var a = document.createElement("a");
	a.href = "http://play.google.com/store/apps/details?id=com.demobo.mobile";
	a.target = "_blank";
	div.appendChild(a);
	var img = document.createElement("img");
	img.src = "http://www.demobo.com/badge_android.png";
	a.appendChild(img);
	
	var div = document.createElement("div");
	document.getElementById(id).appendChild(div);
	var a = document.createElement("a");
	a.href = "https://chrome.google.com/webstore/search/demobo.com?utm_source=chrome-ntp-icon";
	a.target = "_blank";
	newContent = document.createTextNode('How to control more websites using "de Mobo"');
	a.appendChild(newContent);
	a.style.color = 'black';
	div.appendChild(a);
}

function hideDemobo() {
	var temp = document.getElementById('demoboCover');
	if (temp) {
		temp.parentNode.removeChild(temp);
	}
}

function toggleDemobo() {
	var a = document.getElementById('demoboCover');
	if (a) {
		hideDemobo();
	} else {
		showDemobo();
	}
	setDemoboController();
}

function demoboCustomInputDispatcher() {
	console.log("util demoboCustomInputDispatcher");
	this.acceptableCommands = {};
	this.addCommand = function(command, handler) {
		this.acceptableCommands[command] = handler;
	};
	this.addCommands = function(dict) {
		for ( var command in dict) {
			this.acceptableCommands[command] = dict[command];
		}
	};
	this.execCommand = function(command, data) {
		if (command in this.acceptableCommands) {
			this.acceptableCommands[command](data);
		}
	};
}

var demoboInputDispatcher = new demoboCustomInputDispatcher();