console.log('fuck');
var demoboEnabledTabs = [];
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
  activeTab = tabID;
  if (demoboEnabledTabs.indexOf(tabID)===-1){
    demoboEnabledTabs.push(tabID);
  }
});
chrome.extension.onMessage.addListener(onMessage);

/*
  when switching tab, update the brwoseraction icon
*/
chrome.tabs.onActivated.addListener(function(activeInfo){ 
  var currentTabId = activeInfo.tabId
  if (demoboEnabledTabs.indexOf(currentTabId)===-1){
    setBWIcon();
  }else{
    activeTab = currentTabId;
    setIcon();
  }

});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  var index = demoboEnabledTabs.indexOf(tabId);
  if (index!=-1){
    demoboEnabledTabs.splice(index, 1);
  }
});

//catch refresh event
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  console.log(changeInfo);
  if (changeInfo.status && changeInfo.status==='complete'){
    if (demoboEnabledTabs.indexOf(tabId)!=-1){
      chrome.tabs.sendMessage(tabId, {action:'load'});
    }
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
