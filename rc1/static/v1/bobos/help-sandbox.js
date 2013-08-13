(function() {
	// ******************* custom event handler functions ***************************

	var HelpSandbox = window.Bobo.extend();

	HelpSandbox.prototype.onReady = function() {
		console.log('onready is called')
	}

	HelpSandbox.prototype.resumeBobo = function() {
		console.log('inputsandbox\'s resume is clicked');
		//change to inputsandbox
		//    $('.flex-control-nav li a')[3].click();
		$('.flex-control-nav li a')[0].click();

		$('.demo-col textarea').focus();
	};

	// override the initialize function of Bobo
	HelpSandbox.prototype.initialize = function() {
		this.setInfo('iconClass', 'fui-question-sign')
		this.setInfo('priority', 4);
		this.setInfo('boboID', 'helpsandbox');
		this.setInfo('name', 'Bobo HelpSandboxer');
		this.setInfo('description', 'This bobo shows all available bobos of the current website');
		this.setInfo('type', 'generic');

		this.setController({
			url : 'http://rc1.demobo.com/v1/momos/help/control.html?0614',
			//			url : 'http://10.0.0.21:1240/v1/momos/browsertool/control.html?0614',
			orientation : 'portrait'
		});

		this.setInputEventHandlers({
			'demoboApp' : 'onReady',
		});
	};

	// add this app to demoboPortal
	window.demoboPortal.addBobo(HelpSandbox);

})();
