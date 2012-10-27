var activeTabId = null;
var controllers = {};
var qrUrl = null;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete') {
		pingTab(tab.id);
	}
});
chrome.tabs.onCreated.addListener(function (tab) {
	pingTab(tab.id);
});
chrome.tabs.onRemoved.addListener(function(tabid, removeInfo) {
	delete controllers[tabid];
	activeTabId = parseInt(Object.keys(controllers)[0]);
});
chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.sendMessage(tab.id,{action:'toggleDemobo'});
});
chrome.extension.onMessage.addListener(onMessage);

function onMessage(message, sender, sendResponse) {
	if (message.action == 'FromFrontground') {
		if (message.detail) {
			if (message.detail.type == 'register') {
				if (sender.tab.id && message.detail.data) {
					setActiveController(sender.tab.id, message.detail.data);
				}
			} else if (message.detail.type == 'setQRUrl') {
				qrUrl = message.detail.data;
			}
		}
	} else if (message.action == 'FromPopup') {
		sendResponse({tabId: activeTabId, controller: getActiveController(), qrUrl: qrUrl});
	}
};
function pingTab(tabId) {
	chrome.tabs.sendMessage(tabId,{action:'ping', extesionDetail: chrome.app.getDetails()}, function(response) {
		chrome.browserAction.enable(tabId);
//		chrome.browserAction.setPopup({tabId: tabId, popup: ""});
	});
}
function setActiveController(tabId, controller) {
	activeTabId = tabId;
	controllers[tabId] = controller;
}
function getActiveController() {
	return controllers[activeTabId];
}