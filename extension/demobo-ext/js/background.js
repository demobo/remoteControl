
var activeTabs = []; // ids of tabs which demobo is running

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
  if (activeTabs.indexOf(tabID)===-1){
    activeTabs.push(tabID);
  }
});
chrome.extension.onMessage.addListener(onMessage);

/*
  when switching tab, update the brwoseraction icon
*/
chrome.tabs.onActivated.addListener(function(activeInfo){ 
  if (activeTabs.indexOf(activeInfo.tabId)===-1){
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
