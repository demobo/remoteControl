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
  };
  
  InputSandbox.prototype.onSelect = function(){
    var element = document.activeElement;
    element.focus();
    element.select();
  };

  InputSandbox.prototype.resume = function(){
    console.log('inputsandbox\'s resume is clicked');
    //change to inputsandbox
    $('.flex-control-nav li a')[3].click();
    $('.demo-col textarea').focus();
  };

  InputSandbox.prototype.next = function(){
    if (document.activeElement.tagName === 'INPUT'){
      console.log('textarea should go');
      $('.slide-showcase textarea').focus();
    }else{
      console.log('input should go');
      $('.slide-showcase input').focus();
    }
  };

  // override the initialize function of Bobo
  InputSandbox.prototype.initialize = function(){
    this.getInfo('config')['iconUrl'] = 'test1.png'
    this.setInfo('iconClass', 'fui-keyboard')
    this.setInfo('boboID', 'inputsandbox');
    this.setInfo('name', 'Sandbox Input Bobo');
    this.setInfo('description', 'A sandbox bobo that is only supposed to work on demobo.com');
    this.setInfo('type', 'specific');

    this.setController({
     url: 'http://rc1.demobo.com/v1/momos/inputtool/control.html?0614',
     orientation: 'portrait'
    });

    this.setInputEventHandlers({
     'demoboApp':   'onReady',
     'typing-area': 'insertTextAtCursor',
     'enter-button' : 'onEnter',
	   'select-button' : 'onSelect',
     'next-button': 'next'
    });

  };

  // add this app to demoboPortal
  window.demoboPortal.addBobo(InputSandbox);
  
})();
