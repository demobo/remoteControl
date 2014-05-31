(function() {
  	var Famous = window.Bobo.extend();
	
  	Famous.prototype.initialize = function(){
	    this.setInfo('priority', 2);
	    this.setInfo('iconClass', 'fui-play-circle');
	    this.setInfo('boboID', 'famous');
	    this.setInfo('name', 'Remote Control for famous');
	    this.setInfo('description', 'This is a remote control for famous');
	    this.setInfo('type', 'specific');

	  	this.setInfo('ui', {

	  	});
	  
    	this.setInfo('curChannel', 0);

		// your custom demobo input event dispatcher
		this.setInputEventHandlers( {
			'demoboApp':   'onReady',
		});
		
		this.codeArea = $('.ace_content');
		var counter = 0;
		var codeText;
		var controller = {
			url : 'http://rc1.demobo.com/rc/famous?' + counter,
			orientation: 'portrait'
		};
		this.setController( controller );
		var onChange = debounce(_onChange.bind(this),500);
		function _onChange(e) {
			console.log(1);
			if (codeText==this.codeArea.text()) return;
			codeText=this.codeArea.text();
			counter = (counter+1)%2;
			var controller = {
				url : 'http://rc1.demobo.com/rc/famous?' + counter,
				orientation: 'portrait'
			};
			demobo.setController( controller );
		}
		setTimeout(function(){
			this.codeArea.bind("DOMSubtreeModified", onChange.bind(this));
		}.bind(this),1000);
			
	};

	// ********** custom event handler functions *************
	Famous.prototype.onReady = function () {
		var code = "function render() { " + this.codeArea.text() + " }";
		demobo.callFunction("eval", code);
		demobo.callFunction("render","");
	};

	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};
  window.demoboPortal.addBobo(Famous);
})();
