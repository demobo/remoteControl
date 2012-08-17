function CustomInputDispatcher(){
  this.acceptableCommands = {};
  this.addCommand = function (command, handler) {
    this.acceptableCommands[command] = handler;
  };
  this.addCommands = function (dict) {
    for (var command in dict) {
      this.acceptableCommands[command] = dict[command];
    }

  }
  this.execCommand = function (command, data) {
    if (command in this.acceptableCommands){
      this.acceptableCommands[command](data);
    }
  }
}

var myInputDispatcher = new CustomInputDispatcher();

function getAbsPosition(element) {                                                                               
  if (element) {
    var oLeft = 0;
    var oTop = 0;
    var o = element;
    do {
      oLeft += o.offsetLeft;
      oTop += o.offsetTop;
    } while (o = o.offsetParent);
    return {
        'left' : oLeft,
        'top' : oTop
    };
  } else {
    return {};
  }
}

function playVideo(){
//  d$('.playButton').click();
//  Pandora.pauseMusic();
  $('#demoboPlay').click();
}

function pauseVideo(){
//  d$('.pauseButton').click();
//  Pandora.pauseMusic(1);
  $('#demoboPause').click();
}

function skipVideo(){
  $('.skipButton').click();
}

function thumbUp(){
  $('.thumbUpButton').click();
}

function thumbDown(){
  $('.thumbDownButton').click();
}

function getInfoObject(){

  return {
    'title':$('.songTitle').text(),
    'artist':$('.artistSummary').text(),
    'album':$('.albumTitle').text(),
    'image':$('.playerBarArt').attr('src')
  };
}

function getStationList(){
  var toReturn = [];
  $.each($('.stationNameText'), function(index, elem){
    toReturn.push({'title':$(elem).text()});
  });
  return toReturn;
}

function sendStationList(){
  demobo.callFunction('loadChannelList', getStationList());
}

function sendPhoneInfo(){
  demobo.callFunction('loadSongInfo', getInfoObject());
}

function setVolume(num){
  num = parseInt(num);
  $('.volumeBackground').show();
  var min = getAbsPosition($('.volumeBar')[0]).left+22;
  var max = min+$('.volumeBar').width();
  var target = Math.floor(num/100.0*(max-min))+min-22;
  console.log('min: '+min+';max: '+max+';target: '+target);
  $('.volumeBackground').show().trigger({type:'click',pageX:target});
}

function chooseStation(index){
  index = parseInt(index);
  $($('.stationNameText')[index]).click();
}

function setController(){
  DEMOBO.controller = {page: "default", url:"http://rc1.demobo.com/rc/pandora", touchEnabled: true};
// DEMOBO.controller = {"page": "presentation"};  
  demobo.setController(DEMOBO.controller);  
}

function setDevice(data) {
  device = data;
  console.log(device);
  hideDemobo();
}

myInputDispatcher.addCommands({
  'playButton' : playVideo ,
  'pauseButton' : pauseVideo ,
  'loveButton' : thumbUp ,
  'spamButton' : thumbDown ,
  'nextButton' : skipVideo ,
  'volumeSlider' : setVolume ,
  'nowPlayingTab' : sendPhoneInfo ,
  'stationsTab' : sendStationList ,
  'stationItem' : chooseStation ,
  'demoboApp' : function(){
    sendPhoneInfo();
    sendStationList();
    hideDemobo();
  }
});


function myInitiation(){
  //TODO: 1 bind external function doesn't work
  $('.albumArt').bind('ajaxComplete', function(e){
    var newPic = d$('.albumArt').children().last().attr('src');
    console.log('new:'+ newPic+';old:'+currentPic);
    if (newPic != currentPic){
      currentPic = newPic;
      sendPhoneInfo();
    }
  });
  var device;
  var a = document.createElement('div');
  a.setAttribute('onclick','javascript:document.querySelector(".playButton").click()');
  a.setAttribute('id', 'demoboPlay');
  var b = document.createElement('div');
  b.setAttribute('onclick','javascript:document.querySelector(".pauseButton").click()');
  b.setAttribute('id', 'demoboPause');
  document.body.appendChild(a);
  document.body.appendChild(b);

}

//main logic
(function(){
  console.log('fuck');
  if (DEMOBO) {
    //developer authentication, now hardcoded
    DEMOBO.developer = 'developer@demobo.com';
    DEMOBO.maxPlayers = 1;
    DEMOBO.stayOnBlur = true;
    DEMOBO.init = function(){
      setController();
      demobo.addEventListener('input', function(e){
        console.log(e);
//        var evt = {source: e.source, value: e.value};
//        handleRemoteInput(evt);
        myInputDispatcher.execCommand(e.source, e.value);
      });
      demobo.addEventListener('connected', function(e){
        console.log('connected');
      });
      showDemobo();
      demobo.getDeviceInfo('','setDevice');
    }
  }

  demobo.start();

  var currentPic;
  
  console.log('here');

  myInitiation();

  demoboLoading = undefined;
  localStorage.removeItem('demoboExtLoading');
}());



