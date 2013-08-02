(function() {
	// ******************* custom event handler functions ***************************

	var Help = window.Bobo.extend();

	Help.prototype.onReady = function() {
		console.log('onready is called')
	}

	// override the initialize function of Bobo
	Help.prototype.initialize = function() {
		this.setInfo('iconClass', 'fui-question-sign')
		this.setInfo('priority', -1);
    this.setInfo('boboID', 'help');
    this.setInfo('name', 'Bobo Helper');
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
	window.demoboPortal.addBobo(Help);

})();
