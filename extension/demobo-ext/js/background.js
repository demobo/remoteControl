
var activeTab; // ids of tabs which demobo is running

setBWIcon();

/**
  turn on demobo if it is not already on
**/
chrome.browserAction.onClicked.addListener(function(tab){
  if (tab.url.indexOf('chrome')===0){
    return;
  }
	chrome.tabs.sendMessage(tab.id,{action:'toggleDemobo'});
  setIcon();
  var tabID = tab.id;
  if (activeTab){
    //send message to tab to turn off favicon
    chrome.tabs.sendMessage(activeTab, {action:'off'});
  }
  activeTab = tabID;
});
chrome.extension.onMessage.addListener(onMessage);

/*
  when switching tab, update the brwoseraction icon
*/
chrome.tabs.onActivated.addListener(function(activeInfo){ 
  currentTabId = activeInfo.tabId
  if (activeTab != currentTabId){
    setBWIcon();
  }else{
    setIcon();
  }
});
 

function setIcon() {
		chrome.browserAction.setIcon({
			path: 'images/19.png'
		});
}

function setBWIcon(){
		chrome.browserAction.setIcon({
			path: 'images/19_bw.png'
		});
}

function onMessage(){
  
}
