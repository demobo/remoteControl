(function() {
	// ******************* custom event handler functions ***************************

	var Inputtool = window.Bobo.extend();

	Inputtool.prototype.onReady = function() {
		console.log('onready is called')
		console.log(arguments);
		console.log(this);
	}

	Inputtool.prototype.insertTextAtCursor = function(text) {
		console.log('insert is called')
		console.log(arguments);
		console.log(this);

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
		var element = document.activeElement;

		var ke1 = document.createEvent("KeyboardEvent");
		ke1.initKeyboardEvent("keydown", true, true, null, "U+0008", 0, "");
		element.dispatchEvent(ke1);

		var e = document.createEvent('KeyboardEvent');
		e.initKeyboardEvent('keyup', true, true, null, "U+0008", 0, "");
		element.dispatchEvent(e);

		element.focus();
	}

  Inputtool.prototype.onNext = function(){
    console.log('next');
    if (document.domain==='mail.google.com'){
      return;
    }
    var temp = document.querySelectorAll('input[type="text"],textarea');
    var eles = []
    for (var i = 0; i<temp.length; i++){
      if (temp[i].style.display!='none'){
        eles.push(temp[i]);
      }
    }
    var num = eles.length;
    var lastActiveIndex = this.getInfo('index');
    var e = document.activeElement;
    if (e.tagName!='INPUT' && e.tagName!='TEXTAREA'){
      eles[lastActiveIndex].focus();
    }else{
      lastActiveIndex = (lastActiveIndex+1)%num;
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
//			url : 'http://10.0.0.21:1240/v1/momos/inputtool/control.html?0614',
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
