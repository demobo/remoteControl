var extensionData = {};
extensionData.activeTabId = null;
extensionData.controllers = {};
extensionData.qrUrl = localStorage.getItem('qrUrl');
// phone connection is by fault on
extensionData.autoConnect = localStorage.getItem('autoConnect')!='false';
extensionData.details = chrome.app.getDetails();

setIcon();
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	delete extensionData.controllers[tabId];
	if (extensionData.activeTabId==tabId) setActiveTabIdFromQueue();
});
chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.sendMessage(tab.id,{action:'toggleDemobo'});
});
chrome.extension.onMessage.addListener(onMessage);

function setIcon() {
	console.log('setIcon', extensionData.autoConnect);
	if (JSON.parse(extensionData.autoConnect)) {
		chrome.browserAction.setIcon({
			path: 'images/19.png'
		});
	} else {
		chrome.browserAction.setIcon({
			path: 'images/19bw.png'
		});
	}
}
function onMessage(message, sender, sendResponse) {
	switch (message.action) {
	case 'FromFrontground':
		if (message.detail) {
			if (message.detail.type == 'register') {
				if (sender.tab.id && message.detail.data) {
					setActiveController(sender.tab.id, message.detail.data);
				}
				if (extensionData.activeTabId && extensionData.autoConnect) chrome.tabs.sendMessage(extensionData.activeTabId,{action:'connectDemobo'});
			} else if (message.detail.type == 'setData') {
				setData(message.detail.data.key, message.detail.data.value);
			}
		}
		break;
	case 'getData':
		sendResponse(extensionData);
		break;
	case 'setData':
		if (message.detail && message.detail.key) {
			setData(message.detail.key, message.detail.value);
		}
		break;
	default:
	}
};
function setData(key, value){
	extensionData[key] = value;
	if (key=='qrUrl' || key=='autoConnect') localStorage.setItem(key,value);
	setIcon();
}
function setActiveTabIdFromQueue() {
	var nextTabId = parseInt(Object.keys(extensionData.controllers)[0]);
	if (nextTabId) {
		chrome.tabs.get(nextTabId, function(tab) { 
			if (!tab) { 
				delete extensionData.controllers[nextTabId];
				setActiveTabIdFromQueue();
			} else {
				extensionData.activeTabId = nextTabId;
			}
		});
	} else extensionData.activeTabId = null;
}
function setActiveController(tabId, controller) {
	extensionData.activeTabId = tabId;
	extensionData.controllers[tabId] = controller;
}
function getActiveController() {
	return extensionData.controllers[extensionData.activeTabId];
}