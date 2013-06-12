(function(){
  // ******************* custom event handler functions ***************************

  Inputtool = window.Bobo.extend();

  Inputtool.prototype.onReady = function(){
    console.log('onready is called')
    console.log(arguments);
    console.log(this);
  }
  
  Inputtool.prototype.insertTextAtCursor = function(text){
    console.log('insert is called')
    console.log(arguments);
    console.log(this);

    var element = document.activeElement
  
    var e = document.createEvent('TextEvent');
    e.initTextEvent('textInput', true, true, null, text, 'zh-CN');
    element.dispatchEvent(e);
    element.focus();
  }

  // override the initialize function of Bobo
  Inputtool.prototype.initialize = function(){
    this.getInfo('config')['iconUrl'] = 'test1.png'


    this.setController({
     url: 'http://rc1.demobo.com/rc/inputtool?0201',
     orientation: 'portrait'
    });

    this.setInputEventHandlers({
     'demoboApp':   'onReady',
     'typing-area': 'insertTextAtCursor'
    });

  };

  // add this app to demoboPortal
  window.demoboPortal.addBobo(Inputtool);
  
})();
