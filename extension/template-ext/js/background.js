function onMessage(message, sender, sendResponse) {
  console.log('here at backend: '+message);
  console.log(sender.tab.id);
  console.log(message);

  chrome.pageAction.show(sender.tab.id);

  sendResponse({});
};

chrome.extension.onMessage.addListener(onMessage);

chrome.pageAction.onClicked.addListener(function(tab){
  chrome.tabs.sendMessage(tab.id,'toggleDemobo');
});
