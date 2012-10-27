var activeTabId = null;
var activeController = null;
var qrUrl = null;
var simulator = document.getElementById('simulator');
var connectPage = document.getElementById('connectPage');
var tryDemoboUrl = "http://localhost:1242/try_demobo.html";
var connectPageUrl = "http://localhost:1242/connect_demobo.html";

document.addEventListener("DOMContentLoaded", load, false);
chrome.extension.onMessage.addListener(onMessage);
window.addEventListener('message', function(e) {
	if (e.data) {
		chrome.tabs.sendMessage(activeTabId,{action:'FromPopup', detail: e.data});
	}
});
document.getElementById('phone').onclick = togglePhoneColor;
document.getElementById('homeButton').onclick = onHomeButtonClick;

function onMessage(message, sender, sendResponse) {
	if (message.action == 'FromFrontground') {
		if (message.detail) {
			simulator.contentWindow.postMessage(message.detail.data,'*');
			if (message.detail.type == 'register') {
				resetController(sender.tab.id, message.detail.data);
			} else if (message.detail.type == 'setQRUrl') {
				qrUrl = message.detail.data;
			}
		}
	}
};
function resetController(tabId, controller) {
	if (tabId && controller) {
		activeTabId = tabId;
		activeController = controller;
	}
	if (activeController && activeTabId) {
		simulator.src = activeController.url;
		simulator.onload = function() {
			var detail = {type:"input", source:'demoboApp',value:'',userName:"simulator",deviceID:"simulator"};
			chrome.tabs.sendMessage(activeTabId,{action:'FromPopup', detail: detail});
//			simulator.style.display = 'block';
		};
	} else {
		simulator.src = tryDemoboUrl;
		simulator.onload = function() {
//			simulator.style.display = 'block';
		}
	}
}
function load() {
	chrome.extension.sendMessage({action:'FromPopup'}, function(response){
		qrUrl = response.qrUrl;
		resetController(response.tabId, response.controller);
	});
}
function togglePhoneColor(event) {
	document.body.classList.toggle('white');
	document.body.classList.toggle('black');
}
function onHomeButtonClick(event) {
	event.stopPropagation();
    if(simulator.style.display != 'none') {
    	simulator.style.display = 'none';
    	if (!connectPage.src) {
    		connectPage.src = connectPageUrl;
    		connectPage.onload = function() {
    			if (qrUrl) connectPage.contentWindow.postMessage({qrUrl: qrUrl},'*');
    		}
    	} else {
    		if (qrUrl) connectPage.contentWindow.postMessage({qrUrl: qrUrl},'*');
    	}
    	if (activeTabId) chrome.tabs.sendMessage(activeTabId,{action:'connectDemobo'});
	} else
    	simulator.style.display = 'block';
	return false; 
}