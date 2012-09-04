function showDemobo() {
	var id = 'demoboCover';
	var demoboCover = document.createElement('div');
	demoboCover.setAttribute('id', 'demoboCover');
	demoboCover.style.position = "fixed";
	demoboCover.style.top = "0px";
	demoboCover.style.left = "0px";
	demoboCover.style.width = "100%";
	demoboCover.style.height = "100%";
	demoboCover.style.zIndex = "999999";
	document.body.appendChild(demoboCover);

	var demoboCoverDiv = document.createElement("div");
	demoboCoverDiv.setAttribute('id', 'demoboCoverDiv');
	demoboCoverDiv.style.textAlign = 'center';
	demoboCoverDiv.style.width = '800px';
	demoboCoverDiv.style.backgroundColor = '#CBCBCB';
	demoboCoverDiv.style.fontSize = '30px';
	demoboCoverDiv.style.margin = '30px auto';
	demoboCoverDiv.style.borderRadius = '10px';
	demoboCoverDiv.style.paddingBottom = '60px';
	demoboCoverDiv.style.fontFamily = "Helvetica, Arial";
	demoboCoverDiv.style.fontWeight = "normal";
	demoboCoverDiv.style.textShadow = "0 1px white";
	demoboCoverDiv.style.border = "7px #605F61 solid";
	demoboCover.appendChild(demoboCoverDiv);

	var div = document.createElement("div");
	div.style.position = "relative";
	demoboCoverDiv.appendChild(div);
	var a = document.createElement("a");
	a.setAttribute("onclick","hideDemobo();");
	newContent = document.createTextNode('✕');
	a.appendChild(newContent);

	a.style.position = "absolute";
	a.style.marginTop = "10px";
	a.style.right = "30px";
	a.style.position = "30px";
	a.style.cursor = "pointer";
	a.style.color = "#fff";
	a.style.border = "5px solid #605F61";
	a.style.borderRadius = "30px";
	a.style.background = "#605F61";
	a.style.fontSize = "22px";
	a.style.fontWeight = "bold";
	a.style.display = "inline-block";
	a.style.lineHeight = "0px";
	a.style.padding = "11px 3px";
	a.style.textDecoration = "none";
	a.style.textShadow = "none";
	div.appendChild(a);

	demobo.renderQR('demoboCoverDiv', 1);
	var temp = document.querySelector('#demoboCoverDiv > img');
	temp.style.position = 'relative';
	temp.style.margin = '50px 0px';

	var div = document.createElement("div");
	div.style.textAlign = "center";
	div.style.width = "80%";
	div.style.margin = "auto";
	div.style.paddingBottom = "30px";
	div.style.color = "black";
	newContent = document.createTextNode('First time users, download "de Mobo" on your smartphone and pair with this browser by signing in with this QR code.');
	div.appendChild(newContent);
	demoboCoverDiv.appendChild(div);

	var div = document.createElement("div");
	div.style.textAlign = "center";
	demoboCoverDiv.appendChild(div);
	var a = document.createElement("a");
	a.href = "http://itunes.apple.com/us/app/de-mobo/id519605488?ls=1&mt=8";
	a.target = "_blank";
	div.appendChild(a);
	var img = document.createElement("img");
	img.style.paddingBottom = "10px";
	img.src = "http://www.demobo.com/app_store.png";
	a.appendChild(img);

	var div = document.createElement("div");
	div.style.textAlign = "center";
	demoboCoverDiv.appendChild(div);
	var a = document.createElement("a");
	a.href = "http://play.google.com/store/apps/details?id=com.demobo.mobile";
	a.target = "_blank";
	div.appendChild(a);
	var img = document.createElement("img");
	img.style.paddingBottom = "20px";
	img.src = "http://www.demobo.com/badge_android.png";
	a.appendChild(img);

	var div = document.createElement("div");
	div.style.textAlign = "center";
	demoboCoverDiv.appendChild(div);
	var a = document.createElement("a");
	a.href = "https://chrome.google.com/webstore/search/demobo.com?utm_source=chrome-ntp-icon";
	a.target = "_blank";
	newContent = document.createTextNode('More website remote controls');
	a.appendChild(newContent);
	a.style.color = 'white';
	a.style.textAlign = 'center';
    a.style.width = '800px';
    a.style.backgroundColor = '#605F61';
    a.style.fontSize = '30px';
	a.style.margin = '30px auto';
	a.style.borderRadius = '10px';
	a.style.padding = '10px';
	a.style.fontFamily = "Helvetica, Arial";
	a.style.fontWeight = "normal";
    a.style.textShadow = "0 1px white";
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