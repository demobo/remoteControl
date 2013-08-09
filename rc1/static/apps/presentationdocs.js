(function() {
  // ******************* custom event handler functions ***************************
  var PresentationDocs = window.Bobo.extend();

  PresentationDocs.prototype.onReady = function() {
    window.onReady();
  };

  PresentationDocs.prototype.onVolume = function(val) {
    window.onVolume(val);
  };

  PresentationDocs.prototype.chooseFile = function(index) {
    window.chooseFile(index);
  };

  PresentationDocs.prototype.toggleRecord = function() {
    window.toggleRecord();
  };

  PresentationDocs.prototype.toggleScreen = function() {
    window.toggleScreen();
  };

  PresentationDocs.prototype.prevPage = function() {
    window.prevPage();
  };

  PresentationDocs.prototype.nextPage = function() {
    window.nextPage();
  };


  // override the initialize function of Bobo
  PresentationDocs.prototype.initialize = function() {
    this.setInfo('iconClass', 'fui-keyboard');
    this.setInfo('boboID', 'presentationdocs');
    this.setInfo('name', 'Remote Control for PresentationDocs');
    this.setInfo('description', 'An amazing tool to replacing your keyboard with your phone.');
    this.setInfo('type', 'specific');

    this.setController({
      url : 'http://rc1.demobo.com/rc/presentation?0605',
      orientation : 'portrait'
    });

    DEMOBO.appName = 'www.presentationdocs.com';
    demobo.renderQR();

    this.setInputEventHandlers({
      'demoboApp' : 'onReady',
			'nextButton' : 'nextPage',
			'prevButton' : 'prevPage',
			'screenButton' : 'toggleScreen',
			'recordButton' : 'toggleRecord',
			'fileItem' : 'chooseFile',
			'demoboApp' : 'onReady',
			'demoboVolume' : 'onVolume'
    });

		demobo.addEventListener('connected', addUser, false);

		setTimeout(function() {
			demobo.getDeviceInfo('', 'addUser');
		}, 100);
  	demobo.renderBrowserWarning = function() {
  		showMessage('We only support Safari and Chrome browsers on your laptop or desktop at this moment.', 'Sorry', false);
  		$('.ui-dialog-titlebar-close.ui-corner-all').hide();
  	};
  };

  // add this app to demoboPortal
  window.demoboPortal.addBobo(PresentationDocs);

})();
