(function() {
	// ******************* custom event handler functions ***************************

	var Generic = window.Bobo.extend();

	Generic.prototype.onReady = function() {
		console.log('onready is called');
	};

	// override the initialize function of Bobo
	Generic.prototype.initialize = function() {
		var curUrl = "";
		console.log("Generic init ...");
		console.log(window.location.href);
		this.setController({
			url : 'generic'
		});
		demobo._sendToSimulator('urlChange', {
			url : window.location.href
		});
		demoboBody.addEventListener("FromExtension", function(e) {
			console.log("generic: ", e.detail);
			var evtData = e.detail.data.data;
			switch(evtData.action)
			{
			case "urlChange":
				if (curUrl==evtData.url) return;
				curUrl = evtData.url;
			  	window.location = evtData.url;
			  	break;
			case "":
			  
			  	break;
			default:
			  
			}
		});
		setTimeout(function(){
			demobo._sendToSimulator('event', {url : window.location.href, action:'urlChange'});
		},100);
	};

	// add this adaptor to demoboPortal
	window.demoboPortal.addBobo(Generic);

})();
