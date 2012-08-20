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


//These are defined by developers
function playPauseVideo(){
  DBR.act('pause');
}

function nextVideo(){
  DBR.act('skip');
}

function love(){
  DBR.act('love');
}

function ban(){
  DBR.act('ban');
}

function getInfoObject(){
  var temp = FM.getCurrentSongInfo();
  return {
  'artist' : temp['artistName'] ,
  'song' : temp['songName'],
  'image' : temp['coverUrl']
  };
}

function sendChannelList(){
	var list = $.map($('.channel'), function(value, index){
		var s = {'title':$(value).find('.chl_name').text()};
		if ($(value).hasClass('selected')) s.selected = true;
		return s;
	});
  demobo.callFunction('loadChannelList', list);
}

function getCurrentStationIndex() {
	var toReturn = 0;
	var list = $.map($('.channel'), function(value, index){
		if ($(value).hasClass('selected')) toReturn = index;
	});
	return toReturn;
}

function sendCurrentSongInfo(){
  demobo.callFunction('loadSongInfo', getInfoObject());
  demobo.callFunction('setCurrentChannel', getCurrentStationIndex());
}

function setController(){
  DEMOBO.controller = {page: "default", url:"http://rc1.demobo.com/rc/douban", touchEnabled: true};
  demobo.setController(DEMOBO.controller);  
}

function changeChannel(index){
  index = parseInt(index);
  $($('.chl_name')[index]).trigger('click');
}

function setDevice(data) {
  device = data;
  console.log(device);
  if (data) {
    hideDemobo();
  }
}

//hookup commands and handler, key would be the source of input from cellphone, and value is the corresponding handler
myInputDispatcher.addCommands({
  'playPauseButton' : playPauseVideo,
  'loveButton' : love ,
  'nextButton' : nextVideo,
  'channelTab' : sendChannelList ,
  'channel' : changeChannel ,
  'demoboApp' : function(){
    sendChannelList();
    sendCurrentSongInfo();
    hideDemobo();
  }
});

function myInitiation(){
  var _this={
    target:$('head title')[0],
    oldValue:document.title
  };
  _this.onChange=function(){
    if(_this.oldValue!==document.title)
    {
      _this.oldValue=document.title;
      sendCurrentSongInfo();
    }
  };
  _this.delay=function(){
    setTimeout(_this.onChange,1);
  };
  _this.target.addEventListener('DOMSubtreeModified',_this.delay,false);
}

//main logic
(function (){
  console.log('fuck');
  if (DEMOBO) {
    //developer authentication, now hardcoded
    console.log('DEMOBO is ready');
    DEMOBO.developer = 'developer@demobo.com';
    DEMOBO.maxPlayers = 1;
    DEMOBO.stayOnBlur = true;
    DEMOBO.init = function(){
      setController();
      demobo.addEventListener('input', function(e){
        console.log(e);
        myInputDispatcher.execCommand(e.source, e.value);
        
      });
      demobo.addEventListener('connected', function(e){
        console.log('connected');
      });
      showDemobo();
      demobo.getDeviceInfo('','setDevice');
    }
    demobo.start();
  }
  
  var device;
  console.log('here');
 
  //event that detect change of song 
  myInitiation();

  demoboLoading = undefined;
})();



