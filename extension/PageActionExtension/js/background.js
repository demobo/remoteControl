var extensionData = {};
extensionData.activeTabId = null;
extensionData.controllers = {};
extensionData.qrUrl = localStorage.getItem('qrUrl');
extensionData.autoConnect = localStorage.getItem('autoConnect')=='true';
extensionData.details = chrome.app.getDetails();

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	delete extensionData.controllers[tabId];
	if (extensionData.activeTabId==tabId) setActiveTabIdFromQueue();
});
chrome.extension.onMessage.addListener(onMessage);

function setIcon() {
	if (!extensionData.activeTabId) return;
	chrome.pageAction.show(extensionData.activeTabId);
	if (extensionData.autoConnect) {
		chrome.pageAction.setIcon({
			path: 'images/icon_blue_19.png',
			tabId: extensionData.activeTabId
		});
	} else {
		chrome.pageAction.setIcon({
			path: 'images/icon_bw_19.png',
			tabId: extensionData.activeTabId
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