(function() {
  	var Famous = window.Bobo.extend();
  	
  	var logoUrl = 'http://famo.us/images/famous_symbol.svg';
  	var controllerUrl = 'http://rc1.demobo.com/rc/famous?'+Math.random();
	var counter = 0;
	var codeText;
	var controller = {
		url : controllerUrl + counter,
		orientation: 'portrait'
	};
	var onEditorChange = debounce(_onEditorChange,300);
	
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
		
		this.setController( controller );
		
		$('iframe').on('load', _onDemoChange.bind(this));
		
		if (typeof ace !== 'undefined') {
			_setupEditorEvents.call(this);
			$('body').on('DOMNodeRemoved DOMNodeInserted', '#editor-view', function(e){
				if (e.target == e.currentTarget) _setupEditorEvents.call(this);
			}.bind(this));
		// } else {
			// $('body')[0].addEventListener ('DOMSubtreeModified', function(e){
				// if (e.target && e.target.innerHTML.indexOf('</h2>')>0) 
					// _onDemoChange.call(this);
			// }.bind(this), false);
		}
			
	};

	// ********** custom event handler functions *************
	// Famous.prototype.onReady = function () {
		// if (typeof ace !== 'undefined') {
			// if (this.editor) {
				// if (this.editor.getValue()) {
					// _runFamous.call(this);
				// } else if ($('iframe.famous-surface')[0]) {
					// _onDemoChange.call(this);
					// var iframeSrc = $('iframe.famous-surface').attr('src');
					// if (iframeSrc && iframeSrc.indexOf('.famo.us')!==-1) {
						// demobo.setPage({url: iframeSrc, touchEnabled: true});
					// }
				// }	
			// } else 
				// demobo.setPage({url: logoUrl, touchEnabled: false});
		// } else {
			// _onDemoChange.call(this);
		// }
	// };
	
	Famous.prototype.onReady = function (evtName, evt) {
		if (this.editor && this.editor.getValue())
			_runFamous.call(this, evt.deviceID);
		else
			_onDemoChange.call(this, evt, evt.deviceID);
	};

	function _runFamous(deviceID) {
		var code = "function runFamous() { " + this.editor.getValue() + " }; runFamous();";
		demobo.callFunction("eval", code, deviceID);
		console.log('runFamous', deviceID)
	}

	function _setupEditorEvents(e) {	
		if (this.editor) {
			this.editor.off('change', onEditorChange.bind(this));
			delete this.editor;
		}
		if ($('#editor-view')[0]) {
			this.editor = ace.edit('editor-view');
			this.editor.on('change', onEditorChange.bind(this));
		}
	}
	
	function _onEditorChange(e) {	
		if (codeText==this.editor.getValue()) return;
		console.log('editor change')
		codeText=this.editor.getValue();
		counter = (counter+1)%2;
		controller.url = controllerUrl + counter;
		demobo.setController( controller );
	}
	function _onDemoChange(e, deviceID) {
		console.log('demo changed', deviceID)
		setTimeout(function(){
			var iframeSrc = $('iframe:visible')[0].src;
			var page = {};
			if (iframeSrc && iframeSrc.indexOf('.famo.us')!==-1) {
				if (iframeSrc.indexOf('//')==0) 
					iframeSrc = 'http:' + iframeSrc;
				page.url = iframeSrc;
				page.touchEnabled = true;
				if (deviceID) page.deviceID = deviceID;
			} else {
				page.url = logoUrl;
				page.touchEnabled = false;
				if (deviceID) page.deviceID = deviceID;
			}
			demobo.setPage(page);	
		},30);
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
