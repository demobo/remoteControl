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

function setController(){
  DEMOBO.controller = {page: "default", url:"http://yourController.html", touchEnabled: true};
  demobo.setController(DEMOBO.controller);  
}

//********** finish the functions  *************
function play(){

}

function pause(){

}

function next(){

}

function love(){

}

function spam(){

}

function getInfoObject(){

}

function setDevice(data) {
  if (data) {
    console.log(data);
    hideDemobo();
  }
}

//you needa define the corresponding function in your controller ( 'loadSongInfo' in this example )
function sendCurrentSongInfo(){
  demobo.callFunction('loadSongInfo', getInfoObject());
}

//add or modify comamnds to accomondate your desgin
myInputDispatcher.addCommands({
  'playButton' : play ,
  'pauseButton' : pause ,
  'nextButton' : next ,
  'loveButton' : love ,
  'spamButton' : spam ,
  'demoboApp' : sendCurrentSongInfo  
});

//do all the iniations you need here
function myInitiation(){

}

//*************************************

//dont modify the codes below if you dont know what you are doing
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
  
  console.log('here');

  myInitiation();

  demoboLoading = undefined;
})();

