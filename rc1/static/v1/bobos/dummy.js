(function(){
  Dummy = window.Bobo.extend();

  Dummy.prototype.initialize = function(){
    this.setInfo('iconClass', 'fui-sad');

    this.setController({
      url: 'http://rc1.demobo.com/v1/momos/inputtool?0615',
      orientation: 'portrait'
    });

  };

  Dummy.prototype.resume = function(){
    alert('Dummy Bobo: Which idiot switched me on!');
  };

  window.demoboPortal.addBobo(Dummy);
})();
