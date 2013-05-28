//(function() {
	if (DEMOBO) {
		DEMOBO.developer = 'developer@demobo.com';
		DEMOBO.autoConnect = true;
		DEMOBO.init = init;
		demobo.start();
	}
	demoboLoading = undefined;
	
	var ui = {
		name: 				'inputtool',
		version: 			'0201'
	};
	ui.controllerUrl = "http://rc1.demobo.com/rc/"+ui.name+"?"+ui.version;
//	ui.controllerUrl = "http://10.0.0.15:1242/rc/"+ui.name+"?"+ui.version;
	
	// do all the iniations you need here
	function init() {
		demobo.setController( {
			url : ui.controllerUrl,
			orientation: 'portrait'
		});
		// your custom demobo input event dispatcher
		demobo.mapInputEvents( {
			'demoboApp' : 		onReady,
			'typing-area' : insertTextAtCursor
		});
	}

	// ********** custom event handler functions *************
	function onReady() {

	}
	
	function insertTextAtCursor(text) {
		element = document.activeElement;
		if (document.selection) {
	        element.focus();
	        var sel = document.selection.createRange();
	        sel.text = text;
	        element.focus();
	    } else if (element.selectionStart || element.selectionStart === 0) {
	        var startPos = element.selectionStart;
	        var endPos = element.selectionEnd;
	        var scrollTop = element.scrollTop;
	        element.value = element.value.substring(0, startPos) + text + element.value.substring(endPos, element.value.length);
	        element.focus();
	        element.selectionStart = startPos + text.length;
	        element.selectionEnd = startPos + text.length;
	        element.scrollTop = scrollTop;
	    } else {
	        element.value += text;
	        element.focus();
	    }
	}
//})();