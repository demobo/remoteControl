function getCurrentDomain(){
  return document.domain?document.domain:window.location.hostname;
}
function setController(){
  DEMOBO.controller = {page: "default", url:"http://demo.demobo.com/mobile/carousel.html", touchEnabled: true};  
  d$.demobo.setController(DEMOBO.controller);  
}

function setDevice(data) {
  device = data;
  console.log(device);
  hideDemobo();

}

function isPhoneNumber(string) {
  return string.toUpperCase()==string.toLowerCase();
}

function isLink(string) {
  return (string.substr(0,7) == "http://" || string.substr(0,8) == "https://");
}

function sendToPhone(string) { //string is the text the user selected on the page
  var data = {};
  if (isPhoneNumber(string)) {
    data.text = string;
    data.link = "tel:"+string;
    data.action = "Call Number";
  } else if (isLink(string)) {
    data.text = string;
   data.link = string;
    data.action = "Launch Link";
  } else {
    if (device) 
      var origin = device.latitude + ',' + device.longitude;
    else {
      d$.demobo.getDeviceInfo("", "setDevice");
      origin = "";
    }
    data.text = string;
    data.link = 'http://maps.google.com/maps?saddr=' + origin + '&daddr=' + encodeURIComponent(string);
    data.action = "Driving Direction";
  }
  d$.demobo.callFunction('popup',data);
  console.log(string);
  return 'successful';
}

function sendSelection(string){
  djQuery('body').trigger({
    'type' : 'demobo',
    'string' : string
  });
}

function connect(){
   djQuery('body').trigger({
    'type' : 'demobo',
    'cmd' : 'connect',
  });
}

function disconnect(){
   djQuery('body').trigger({
    'type' : 'demobo',
    'cmd' : 'disconnect',
  });
}

function init(){
   djQuery('body').trigger({
    'type' : 'demobo',
    'cmd' : 'initt',
  });
}

function demoboDispatcher(e){
  if (e.cmd == 'disconnect'){
    console.log('disconnect');
    d$.demobo.disconnect();
  }else if (e.cmd == 'connect') {
    console.log('connect');
    d$.demobo.connect();
    setController();
  } else if ( e.string ) {
    sendToPhone( msg.string );
  } else {
    console.log('unhandled message to background.html: ' + JSON.stringify(e) );
  }
}

function handleRemoteInput(evt) {
  console.log(evt);
  if (typeof(evt.value) == 'object') {
    handleDnd(evt);
  } else {
    var target = d$('#'+evt.source)[0]?d$('#'+evt.source):d$('.'+evt.source);
    var tagName = (target.first().prop('tagName')||"").toLowerCase();
    var type = (target.first().prop('type')||"").toLowerCase();
    if (tagName == 'input' && type == 'text') 
    { 
      target.first().prop('value',evt.value).change().focus().keyup();
      //d$('.item.paddedItem').first().click();
    } else {
      target.click();
    }
  }
}

function handleDnd(e) {
  var curtop = parseInt(e.value.top)*dpiAdjust;
  var curleft= parseInt(e.value.left)*dpiAdjust;
  var prevTop = parseInt(e.value.prevTop)*dpiAdjust;
  var prevLeft= parseInt(e.value.prevLeft)*dpiAdjust;
  var target = d$(e.value.html);
  d$('#iphoneDockScreen').append(target);
  target.css({top:curtop, left:curleft, width: target.width()*dpiAdjust, height: target.height()*dpiAdjust});
  var deltaTop = 10*(curtop-prevTop);
  var deltaLeft = 10*(curleft-prevLeft);
  
  var focus = d$("*:focus");
  if (focus[0]) {
    target.animate({top: "+="+deltaTop+"px", left: "+="+deltaLeft+"px"}, 500);
    var top = focus.position().top - d$('#iphoneDockScreen').position().top + 50;
    var left = focus.position().left - d$('#iphoneDockScreen').position().left + 450;
    target.animate({top: top, left: left}, 1000, function(){
      target.fadeOut('slow', function() {
        focus.text(target.children('img').prop('src')).change();
        target.remove();
      });
    });
  }
  else {
    target.animate({top: "+="+deltaTop+"px", left: "+="+deltaLeft+"px"}, 500, function(){
      target.fadeOut('slow', function() {
        target.remove();
      });
    });
  }
}

//***************华丽的分割线***************************************************
//These two are for extensionss
function onMenuClick(e) {
  var data = {};
  if (e.linkUrl) {
    data.text = e.selectionText;
    data.link = e.linkUrl;
    data.action = "Launch Link";
  } 
  else if (e.mediaType=="image" && e.srcUrl) {
    data.text = '<img src="'+e.srcUrl+'"/>';
    data.link = e.srcUrl;
    data.action = "View Image";
    data.type = 'image';
  }
  else if (e.selectionText) {
    if (isPhoneNumber(e.selectionText)) {
      data.text = e.selectionText;
      data.link = "tel:"+e.selectionText;
      data.action = "Call Number";
    } else if (isLink(e.selectionText)) {
      data.text = e.selectionText;
      data.link = e.selectionText;
      data.action = "Launch Link";
    } else {
      if (device) 
        var origin = device.latitude + ',' + device.longitude;
      else {
        d$.demobo.getDeviceInfo("", "setDevice");
        origin = "";
      }
      data.text = e.selectionText;
      data.link = 'http://maps.google.com/maps?saddr=' + origin + '&daddr=' + encodeURIComponent(e.selectionText);
      data.action = "Driving Direction";
    }
  }
  else if (e.pageUrl) {
    data.text = e.pageUrl;
    data.link = e.pageUrl;
    data.action = "Launch Page";
  }
  if (data.text) d$.demobo.callFunction('popup',data);
  return true;
}

if (chrome && chrome.contextMenus){
  chrome.contextMenus.create({
    "title": "Send to phone",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : onMenuClick
  });
}
//***************华丽的分割线***************************************************

//main logic
d$(document).ready(function(){
  console.log('fuck');
  if (DEMOBO) {
    //developer authentication, now hardcoded
    DEMOBO.developer = 'developer@demobo.com';
    DEMOBO.maxPlayers = 1;
    DEMOBO.init = function(){
      setController();
      d$.demobo.addEventListener('input', function(e){
        console.log(e);
        var evt = JSON.stringify({source: e.source, value: e.value});
        handleRemoteInput(evt);
      });
      d$.demobo.addEventListener('connected', function(e){
        console.log('connected');
        hideDemobo();
        setController();
      });
      showDemobo();
      d$.demobo.getDeviceInfo('','setDevice');
    }
  }
  
  var device;
  console.log('here');
  demoboLoading = undefined;
});



