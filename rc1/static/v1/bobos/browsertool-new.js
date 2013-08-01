(function() {
	// ******************* custom event handler functions ***************************

	var Browsertool = window.Bobo.extend();

	Browsertool.prototype.onReady = function() {
		console.log('onready is called')
		console.log(arguments);
		console.log(this);
	}

	Browsertool.prototype.navigateTo = function(text) {
		console.log(text);
		goto(text);
		function goto(url) {
			window.location = 'http://'+url;
		}

	}
	// override the initialize function of Bobo
	Browsertool.prototype.initialize = function() {
		this.setInfo('iconClass', 'fui-earth')
		this.setInfo('priority', 1);
    this.setInfo('boboID', 'catalog');

		this.setController({
			url : 'http://rc1.demobo.com/v1/momos/browsertool/control.html?0614',
//			url : 'http://10.0.0.21:1240/v1/momos/browsertool/control.html?0614',
			orientation : 'portrait'
		});

		this.setInputEventHandlers({
			'demoboApp' : 'onReady',
			'navigateTo' : 'navigateTo'
		});

	};

	// add this app to demoboPortal
	window.demoboPortal.addBobo(Browsertool);

})();
