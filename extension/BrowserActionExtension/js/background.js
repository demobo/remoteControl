var extensionData = {};
extensionData.activeTabId = null;
extensionData.controllers = {};
extensionData.qrUrl = localStorage.getItem('qrUrl');
extensionData.autoConnect = localStorage.getItem('autoConnect')=='true';
extensionData.details = chrome.app.getDetails();

setIcon();
//chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//	if (changeInfo.status == 'complete') {
//		pingTab(tab.id);
//	}
//});
//chrome.tabs.onCreated.addListener(function (tab) {
//	pingTab(tab.id);
//});
chrome.tabs.onRemoved.addListener(function(tabid, removeInfo) {
	delete extensionData.controllers[tabid];
	extensionData.activeTabId = parseInt(Object.keys(extensionData.controllers)[0]);
});
chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.sendMessage(tab.id,{action:'toggleDemobo'});
});
chrome.extension.onMessage.addListener(onMessage);

function setIcon() {
	if (extensionData.autoConnect) {
		chrome.browserAction.setIcon({
			path: 'images/icon_blue_19.png'
		});
	} else {
		chrome.browserAction.setIcon({
			path: 'images/icon_bw_19.png'
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
//function pingTab(tabId) {
//	var extDetail = chrome.app.getDetails();
//	extDetail.autoConnect = extensionData.autoConnect;
//	chrome.tabs.sendMessage(tabId,{action:'ping', extesionDetail: extDetail}, function(response) {
//		chrome.browserAction.enable(tabId);
//	});
//}
function setActiveController(tabId, controller) {
	extensionData.activeTabId = tabId;
	extensionData.controllers[tabId] = controller;
}
function getActiveController() {
	return extensionData.controllers[extensionData.activeTabId];
}