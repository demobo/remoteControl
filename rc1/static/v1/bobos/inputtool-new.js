(function() {
	// ******************* custom event handler functions ***************************

	var Inputtool = window.Bobo.extend();

	Inputtool.prototype.onReady = function() {

	}

	Inputtool.prototype.insertTextAtCursor = function(text) {
		var element = document.activeElement
		var e = document.createEvent('TextEvent');
		e.initTextEvent('textInput', true, true, null, text, 'zh-CN');
		element.dispatchEvent(e);
		element.focus();
	}

	Inputtool.prototype.onEnter = function() {
		var element = document.activeElement;
		var e = document.createEvent('TextEvent');
		e.initTextEvent('textInput', true, true, null, "\n", 'zh-CN');
		element.dispatchEvent(e);
		element.focus();
	}

	Inputtool.prototype.onSelect = function() {
		var element = document.activeElement;
		element.focus();
		element.select();
	}

	Inputtool.prototype.onDelete = function() {
		backspace();
	}
	function getCaret(el) {
		if (el.selectionStart) {
			return el.selectionStart;
		} else if (document.selection) {
			el.focus();

			var r = document.selection.createRange();
			if (r == null) {
				return 0;
			}

			var re = el.createTextRange(), rc = re.duplicate();
			re.moveToBookmark(r.getBookmark());
			rc.setEndPoint('EndToStart', re);

			return rc.text.length;
		}
		return 0;
	}

	function resetCursor(txtElement, currentPos) {
		if (txtElement.setSelectionRange) {
			txtElement.focus();
			txtElement.setSelectionRange(currentPos, currentPos);
		} else if (txtElement.createTextRange) {
			var range = txtElement.createTextRange();
			range.moveStart('character', currentPos);
			range.select();
		}
	}

	function backspace() {
		var textarea = document.activeElement;
		var start = textarea.selectionStart;
		var end = textarea.selectionEnd;
		if (start === end)
			start--;
		var text = textarea.value;
		textarea.value = text.substr(0, start) + text.substr(end, text.length);
		resetCursor(textarea, start);
	}


	Inputtool.prototype.onNext = function() {
		if (document.domain === 'mail.google.com') {
			return;
		}
		var temp = document.querySelectorAll('input[type="text"],textarea');
		var eles = []
		for (var i = 0; i < temp.length; i++) {
			if (temp[i].style.display != 'none') {
				eles.push(temp[i]);
			}
		}
		var num = eles.length;
		var lastActiveIndex = this.getInfo('index');
		var e = document.activeElement;
		if (e.tagName != 'INPUT' && e.tagName != 'TEXTAREA') {
			eles[lastActiveIndex].focus();
		} else {
			lastActiveIndex = (lastActiveIndex + 1) % num;
			eles[lastActiveIndex].focus();
			this.setInfo('index', lastActiveIndex);
		}
	};

	// override the initialize function of Bobo
	Inputtool.prototype.initialize = function() {
		this.getInfo('config')['iconUrl'] = 'test1.png'
		this.setInfo('iconClass', 'fui-keyboard');
		this.setInfo('boboID', 'inputtool');
		this.setInfo('name', 'Input Tool');
		this.setInfo('description', 'An amazing tool to replacing your keyboard with your phone.');
		this.setInfo('type', 'generic');
		this.setInfo('index', 0);

		this.setController({
			url : 'http://rc1.demobo.com/v1/momos/inputtool/control.html?0614',
			//      url : 'http://10.0.0.21:1240/v1/momos/inputtool/control.html?0614',
			orientation : 'portrait'
		});

		this.setInputEventHandlers({
			'demoboApp' : 'onReady',
			'typing-area' : 'insertTextAtCursor',
			'enter-button' : 'onEnter',
			'select-button' : 'onSelect',
			'next-button' : 'onNext',
			'delete-button' : 'onDelete'
		});

	};

	// add this app to demoboPortal
	window.demoboPortal.addBobo(Inputtool);

})();
