(function(){
  // ******************* custom event handler functions ***************************

  var InputSandbox = window.Bobo.extend();

  InputSandbox.prototype.onReady = function(){
    console.log('onready is called')
  }
  
  InputSandbox.prototype.insertTextAtCursor = function(text){
    console.log('insert is called')

    var element = document.activeElement
  
    var e = document.createEvent('TextEvent');
    e.initTextEvent('textInput', true, true, null, text, 'zh-CN');
    element.dispatchEvent(e);
    element.focus();
  }
  
  InputSandbox.prototype.onEnter = function() {
	var element = document.activeElement;
	var e = document.createEvent('TextEvent');
    e.initTextEvent('textInput', true, true, null, "\n", 'zh-CN');
    element.dispatchEvent(e);
    element.focus();
  }
  
  InputSandbox.prototype.onSelect = function(){
    var element = document.activeElement;
    element.focus();
    element.select();
  }

  // override the initialize function of Bobo
  InputSandbox.prototype.initialize = function(){
    this.getInfo('config')['iconUrl'] = 'test1.png'
    this.setInfo('iconClass', 'fui-keyboard')

    this.setController({
     url: 'http://rc1.demobo.com/rc/inputtool/control.html?0614',
     orientation: 'portrait'
    });

    this.setInputEventHandlers({
     'demoboApp':   'onReady',
     'typing-area': 'insertTextAtCursor',
     'enter-button' : 'onEnter',
	 'select-button' : 'onSelect'
    });

  };

  // add this app to demoboPortal
  window.demoboPortal.addBobo(InputSandbox);
  
})();
