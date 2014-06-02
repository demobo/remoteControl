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
			'demoboApp':   'onReady'
		});
		
		var controllerUrl = 'http://rc1.demobo.com/rc/famous?'+Math.random();
		var counter = 0;
		var codeText;
		var controller = {
			url : controllerUrl + counter,
			orientation: 'portrait'
		};
		this.setController( controller );
		if (typeof ace !== 'undefined' && $('#editor-view')[0]) {
			this.editor = ace.edit('editor-view');
			if (this.editor) {
				var onChange = debounce(_onChange.bind(this),300);
				function _onChange(e) {	
					console.log(1);
					if (codeText==this.editor.getValue()) return;
					console.log(2);
					codeText=this.editor.getValue();
					counter = (counter+1)%2;
					controller.url = controllerUrl + counter;
					demobo.setController( controller );
				}
				this.editor.on('change', onChange.bind(this));
			}
		} else {
			$('body')[0].addEventListener ('DOMSubtreeModified', 
				function(e){
					if (e.target && e.target.innerHTML.indexOf('</h2>')>0) 
						_onDemoChange.call(this);
				}.bind(this), false);
		}
			
	};

	// ********** custom event handler functions *************
	Famous.prototype.onReady = function () {
		if (this.editor) {
			var code = "function render() { " + this.editor.getValue() + " }";
			demobo.callFunction("eval", code);
			demobo.callFunction("render","");
			console.log(3);
		} else {
			_onDemoChange.call(this);
		}
	};

	function _onDemoChange() {
		setTimeout(function(){
			var iframeSrc = $('iframe:visible').attr('src');
			if (iframeSrc) {
				demobo.setPage({url: iframeSrc, touchEnabled: true});	
			}
		},300);
	}
	
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
