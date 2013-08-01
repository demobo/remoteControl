(function(){
  // ******************* custom event handler functions ***************************

  var PhoneSandbox = window.Bobo.extend();

  PhoneSandbox.prototype.onReady = function(){
    console.log('onready is called')
  }
  
  // override the initialize function of Bobo
  PhoneSandbox.prototype.initialize = function(){
		this.setInfo('iconClass', 'fui-earth');
    this.setInfo('boboID', 'phonesandbox');
    this.setInfo('name', 'Sandbox Phone Bobo');
    this.setInfo('description', 'A sandbox bobo that is only supposed to work on demobo.com');
    this.setInfo('type', 'specific');


    this.setController({
//    set proper Momo     
     url: 'http://rc1.demobo.com/v1/momos/browsertool/control.html?0614',
     orientation: 'portrait'
    });

    this.setInputEventHandlers({
     'demoboApp':   'onReady'
    });

  };

  PhoneSandbox.prototype.resume = function(){
    console.log('PhoneSandbox\'s resume is called');
    $('.flex-control-nav li a')[2].click();
  };

  // add this app to demoboPortal
  window.demoboPortal.addBobo(PhoneSandbox);
  
})();
