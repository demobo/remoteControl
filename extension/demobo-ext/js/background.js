setIcon();
chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.sendMessage(tab.id,{action:'toggleDemobo'});
});
chrome.extension.onMessage.addListener(onMessage);

function setIcon() {
		chrome.browserAction.setIcon({
			path: 'images/icon_blue_19.png'
		});
//		chrome.browserAction.setIcon({
//			path: 'images/icon_bw_19.png'
//		});
}

