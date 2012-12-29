var extensionData = {};
var activeController = null;
var simulator = document.getElementById('simulator');
var connectPage = document.getElementById('connectPage');
var tryDemoboUrl = "http://rc1.demobo.com/try_demobo.html";
var connectPageUrl = "http://rc1.demobo.com/connect_demobo.html";

document.addEventListener("DOMContentLoaded", load, false);
chrome.extension.onMessage.addListener(onMessage);
window.addEventListener('message', function(e) {
	if (e.data) {
		if (e.data.action == 'phoneConnection') {
			setData('autoConnect', e.data.detail);
			if (extensionData.activeTabId) {
				if (e.data.detail) chrome.tabs.sendMessage(extensionData.activeTabId,{action:'connectDemobo'});
				else chrome.tabs.sendMessage(extensionData.activeTabId,{action:'disconnectDemobo'});
			}
			syncData();
		} else {
			if (extensionData.activeTabId) chrome.tabs.sendMessage(extensionData.activeTabId,{action:'FromPopup', detail: e.data});
		}
	}
});
document.getElementById('phone').onclick = togglePhoneColor;
document.getElementById('homeButton').onclick = onHomeButtonClick;

function setData(key, value) {
	chrome.extension.sendMessage({action:'setData', detail: {key: key, value: value}});
}
function getData(callback) {
	chrome.extension.sendMessage({action:'getData'}, callback);
}
function syncData() {
	getData(function(data) {
		extensionData = data;
		activeController = data.controllers[data.activeTabId];
		if (extensionData.autoConnect) document.getElementById('homeButton').classList.add('connected');
		else document.getElementById('homeButton').classList.remove('connected');
		if (extensionData.phoneColor) document.body.className = extensionData.phoneColor;
		var source = 'none';
		if (extensionData.url) source = extensionData.url.split('/')[2].split('.').reverse()[1];
		
		simulator.style.display = 'none';
		var url = tryDemoboUrl+'?' + source + '#'+extensionData.details.version+'&'+extensionData.autoConnect;
		simulator.src = url;
		
		var url = connectPageUrl+'?' + source + '#'+extensionData.details.version+'&'+extensionData.autoConnect;
		if (connectPage.src!=url) {
			connectPage.src = url;
			connectPage.onload = function() {
				connectPage.contentWindow.postMessage({action: 'syncData', detail: extensionData},'*');
			}
		} else {
			connectPage.contentWindow.postMessage({action: 'syncData', detail: extensionData},'*');
		}
	});
}
function onMessage(message, sender, sendResponse) {
	if (message.action == 'FromFrontground') {
		if (message.detail) {
			if (simulator) simulator.contentWindow.postMessage(message.detail.data,'*');
			if (message.detail.type == 'register') {
				syncData();
				if (simulator) simulator.style.display = 'block';
			}
		}
	}
};
function load() {
	syncData();
}
function togglePhoneColor(event) {
	document.body.classList.toggle('white');
	document.body.classList.toggle('black');
	setData('phoneColor', document.body.className);
}
function onHomeButtonClick(event) {
	event.stopPropagation();
	if(simulator.style.display != 'none') {
    	simulator.style.display = 'none';
	} else
    	simulator.style.display = 'block';
	return false; 
}
function onSimulatorHomeButtonClick(event) {
	event.stopPropagation();
    if(simulator.style.display != 'none') {
    	simulator.style.display = 'none';
	} else
    	simulator.style.display = 'block';
	return false; 
}