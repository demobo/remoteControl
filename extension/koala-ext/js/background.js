var myID = "634FCA96-05A2-A7DB-2D6E-5BA7E5D50C9D";
// var myID = "28BE7932-53F1-024F-063C-877712F6861F";
var curWin;
var koalaEnabledTabs = [];
var activeTab;
setBWIcon();
preloadRingtone();
initializeIncomingCall();

/**
 turn on koala if it is not already on
 **/
chrome.browserAction.onClicked.addListener(function(tab) {
	// if (tab.url.indexOf('chrome') === 0) {
		// return;
	// }
	chrome.tabs.sendMessage(tab.id, {
		action : 'toggleKoala'
	});
	setIcon();
	activeTab = tab.id;
	if (koalaEnabledTabs.indexOf(activeTab) === -1) {
		koalaEnabledTabs.push(activeTab);
		var w = 400;
		var maxWidth = window.screen.availWidth;
		var maxHeight = window.screen.availHeight;
		chrome.windows.getCurrent(function(wind) {
			var updateInfo = {
				left : 0,
				top : 0,
				width : maxWidth - w,
				height : maxHeight
			};
			chrome.windows.update(wind.id, updateInfo);
		});
		chrome.windows.create({
			url : 'http://localhost:1250/rc/control.html',
			type : 'popup',
			width : w,
			height : maxHeight,
			left : screen.width - w,
			top : 0
		}, function(window) {
			curWin = window;
			chrome.tabs.sendMessage(curWin.tabs[0].id, {action: "incoming", person: "Jeff", social: "Yammer"});
		});
	}
});
chrome.extension.onMessage.addListener(onMessage);

/*
 when switching tab, update the icon
 */
chrome.tabs.onActivated.addListener(function(activeInfo) {
	var currentTabId = activeInfo.tabId;
	if (koalaEnabledTabs.indexOf(currentTabId) === -1) {
		setBWIcon();
	} else {
		activeTab = currentTabId;
		setIcon();
	}

});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	var index = koalaEnabledTabs.indexOf(tabId);
	if (index != -1) {
		koalaEnabledTabs.splice(index, 1);
	}
});

//catch refresh event
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status && changeInfo.status === 'complete') {
		if (koalaEnabledTabs.indexOf(tabId) != -1) {
			chrome.tabs.sendMessage(tabId, {
				action : 'load',
				data : {
					data : {
						action : 'load',
						url : tab.url
					}
				}
			});
		}
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	console.log(request);
	if (sender.tab.id == activeTab)
		chrome.tabs.sendMessage(curWin.tabs[0].id, request);
	else
		chrome.tabs.sendMessage(activeTab, request);
});

function setIcon() {
	chrome.browserAction.setIcon({
		path : 'images/19.png'
	});
}

function setBWIcon() {
	chrome.browserAction.setIcon({
		path : 'images/19_bw.png'
	});
}

function onMessage() {

}

function call(outgoingId) {
	var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + outgoingId);
	outgoingCallRef.push({
		name : myID
	});
}

function initializeIncomingCall() {
	console.log("init");
	var incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + myID);
	incomingCallRef.on('child_added', function(snapshot) {
		startRingtone();
	});
}

function preloadRingtone() {
	if (document.getElementById('ringtone'))
		return;
	var e = document.createElement('video');
	e.controls = true;
	e.id = 'ringtone';
	e.loop = true;
	e.style.display = 'none';
	e.innerHTML = '<source src="http://rc1-dot-de-mobo.appspot.com/audio/Marimba.mp3" type="audio/mpeg">';
	document.body.appendChild(e);
}

function stopRingtone() {
	var e = document.getElementById('ringtone');
	e && (e.pause() || (e.currentTime = 0));
};
function startRingtone() {
	var e = document.getElementById('ringtone');
	e && e.play();
};