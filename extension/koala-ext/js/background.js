var myID = localStorage.getItem("myID");
var myName = localStorage.getItem("myName");
var myRoom;
var PORTAL_URL = "http://beta.colabeo.com/";

var targetTab;
var dashboardTab;

var isCalling = false;
var curSnapshot;
setBWIcon();
preloadRingtone();
initializeIncomingCall();

/**
 turn on koala if it is not already on
 **/
chrome.browserAction.onClicked.addListener(launch);

function launch() {
	console.log("clicked");
	if (!targetTab) {
		chrome.tabs.create({
			'url' : PORTAL_URL
		}, function(tab) {
			targetTab = tab;
			chrome.tabs.sendMessage(targetTab.id, {
				action : 'toggleKoala'
			});
			chrome.tabs.sendMessage(targetTab.id, {
				data : {
					data : {
						action : 'turnOn'
					}
				}
			});
			if (!dashboardTab) {
				launchDashboard();
			}
		});
	} else if (!dashboardTab) {
		launchDashboard();
	} else {
		resizeTargetSite(400);
	}
}
/*
 when switching tab, update the icon
 */
chrome.tabs.onActivated.addListener(function(activeInfo) {

});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	if (targetTab && tabId == targetTab.id) {
		chrome.windows.remove(dashboardTab.windowId, function() {
		});
	} else if (dashboardTab && tabId == dashboardTab.id) {
		dashboardTab = undefined;
		setBWIcon();
		resizeTargetSite(0);
	}
});

//catch refresh event
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (targetTab && targetTab.id == tabId) {
		console.log("onUpdate", changeInfo);
		chrome.tabs.sendMessage(targetTab.id, {
			action : 'toggleKoala'
		});
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (!dashboardTab || !targetTab)
		return;
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	console.log(request);
	if (request.data.data && request.data.data.action == "syncID") {
		if (myID == request.data.data.id) return;
		localStorage.setItem("myID", request.data.data.id);
		localStorage.setItem("myName", request.data.data.name);
		myID = request.data.data.id;
		myName = request.data.data.name;
		initializeIncomingCall();
	} else if (request.data.data && request.data.data.action == "setProperty") {
		myRoom = request.data.data.roomId;
	} else if (request.data && request.data.action == "getProperty") {
		chrome.tabs.sendMessage(targetTab.id, {
			action : "getProperty",
			id : myID,
			name : myName,
			roomId : myRoom
		});
	} else if (sender.tab.id == targetTab.id) {
		chrome.tabs.sendMessage(dashboardTab.id, request);
	} else
		chrome.tabs.sendMessage(targetTab.id, request);
});

function setIcon() {
	chrome.browserAction.setIcon({
		path : 'images/colabeo19.png'
	});
}

function setBWIcon() {
	chrome.browserAction.setIcon({
		path : 'images/colabeo19_bw.png'
	});
}

function call(outgoingId) {
	var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + outgoingId);
	outgoingCallRef.push({
		name : myID
	});
}

var incomingCallRef;
function initializeIncomingCall() {
	if (incomingCallRef) {
		incomingCallRef.off('child_added', onAdd);
		incomingCallRef.off('child_removed', onRemove);
		incomingCallRef.off('child_changed', onRemove);
	}
	console.log("init " + myID);
	incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/call/' + myID);
	incomingCallRef.on('child_added', onAdd);
	incomingCallRef.on('child_removed', onRemove);
	incomingCallRef.on('child_changed', onRemove);
}

function onAdd(snapshot) {
	curSnapshot = snapshot;
	console.log("onAdd", snapshot);
	startRingtone();

	var opt = {
		type : "basic",
		title : "Caller ID:",
		message : snapshot.val().person,
		iconUrl : "images/colabeo48.png",
		buttons : [
			{ title: "Accept" , iconUrl : "images/48_yes.png" } , { title: "Dismiss" , iconUrl : "images/48_no.png" }
		]
	};
	if (!dashboardTab) {
		chrome.notifications.create(snapshot.name(), opt, function(){});
	}
}

chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex){
	stopRingtone();
	if (buttonIndex == 0) {
		isCalling = true;
		launch();
	}
});

function onRemove(snapshot) {
	stopRingtone();
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
	isCalling = false;
	var e = document.getElementById('ringtone');
	e && (e.pause() || (e.currentTime = 0));
};
function startRingtone() {
	isCalling = true;
	var e = document.getElementById('ringtone');
	e && e.play();
	setTimeout(function() {
		if (dashboardTab && curSnapshot) {
			chrome.tabs.sendMessage(dashboardTab.id, {
				action : "incoming",
				person : curSnapshot.val().person,
				social : curSnapshot.val().source,
				room : curSnapshot.name(),
				answer : false
			});
		}
	}, 100);
};

function resizeTargetSite(w) {
	var maxWidth = window.screen.availWidth;
	var maxHeight = window.screen.availHeight;
	if (targetTab) {
		var updateInfo = {
			left : 0,
			top : 0,
			width : maxWidth - w,
			height : maxHeight
		};
		chrome.windows.update(targetTab.windowId, updateInfo);
		if (w)
			chrome.tabs.update(targetTab.id, {
				pinned : true
			}, function(tab) {
				if (tab) {
					targetTab.favIconUrl = tab.favIconUrl;
					tab.favIconUrl = "";
					console.log(tab);
				} else {
					chrome.tabs.get(targetTab.id,function(tab){
						if (tab.url == PORTAL_URL) {
							chrome.tabs.remove(tab.id, function() {});
						}
					});
					targetTab = undefined;
				}
			});
		else
			chrome.tabs.update(targetTab.id, {
				pinned : false
			}, function(tab) {
				if (tab) {
					tab.favIconUrl = targetTab.favIconUrl;
					chrome.tabs.sendMessage(targetTab.id, {
						data : {
							data : {
								action : 'turnOff'
							}
						}
					});
					console.log(tab);
				}
				chrome.tabs.get(targetTab.id,function(tab){
					if (tab.url == PORTAL_URL) {
						chrome.tabs.remove(tab.id, function() {});
					}
				});
				targetTab = undefined;
			});
	}
	if (dashboardTab) {
		var updateInfo = {
			left : window.screen.width - w,
			top : 0,
			width : w,
			height : maxHeight
		};
		chrome.windows.update(dashboardTab.windowId, updateInfo);
	}
}

function launchDashboard() {
	var w = 400;
	var maxWidth = window.screen.availWidth;
	var maxHeight = window.screen.availHeight;
	chrome.windows.create({
		// url : 'http://colabeo.herokuapp.com/index.html',
		// url : 'https://berry-c9-koalalab.c9.io',
		// url : 'http://colabeo-app.herokuapp.com',
		// url : "http://kings-landing-nodejs-58995.usw1.actionbox.io:3000",
		url : "http://colabeo-alpha.herokuapp.com",
		type : 'popup',
		width : w,
		height : maxHeight,
		left : screen.width - w,
		top : 0
	}, function(window) {
		dashboardTab = window.tabs[0];
		resizeTargetSite(w);
		if (isCalling) {
			// TODO: this is a hack
			setTimeout(function(){
				chrome.tabs.sendMessage(dashboardTab.id, {
					action : "incoming",
					person : curSnapshot.val().person,
					social : curSnapshot.val().source,
					room : curSnapshot.name(),
					answer : true
				});
			},500);
			setTimeout(function(){
				chrome.tabs.sendMessage(dashboardTab.id, {
					action : "incoming",
					person : curSnapshot.val().person,
					social : curSnapshot.val().source,
					room : curSnapshot.name(),
					answer : true
				});
			},2000);
			setTimeout(function(){
				chrome.tabs.sendMessage(dashboardTab.id, {
					action : "incoming",
					person : curSnapshot.val().person,
					social : curSnapshot.val().source,
					room : curSnapshot.name(),
					answer : true
				});
			},4000);
		}
	});
	setIcon();
}
