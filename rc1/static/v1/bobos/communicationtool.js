(function() {
	// ******************* custom event handler functions ***************************

	var Communication = window.Bobo.extend();

	var uniqueId = 0;

	Communication.telephones = [];

	Communication.prototype.pauseBobo = function() {
		//$('#demobo_overlay').css('bottom', -$('#demobo_overlay').height());
		//$('#boboModal').modal('hide');
		//$('#demobo_overlay').hide();
		var demoboWidget = document.getElementById('demobo_overlay');
		demoboWidget.style.display = "none";
	};

	Communication.prototype.resumeBobo = function() {
		//$('#demobo_overlay').css('bottom', 0);
		//$('#boboModal').modal();
		//$('#demobo_overlay').show();
		var demoboWidget = document.getElementById('demobo_overlay');
		// demoboWidget.style.display = "block";
	}

	Communication.prototype.onReady = function() {
		console.log('onready is called')
		console.log(arguments);
		console.log(Communication.telephones);
		this.callFunction('onReceiveData', {
			title : document.title,
			data : Communication.telephones
		});
	}

	Communication.prototype.insertTextAtCursor = function(text) {
		console.log('insert is called')
		console.log(arguments);
		console.log(this);

		var element = document.activeElement

		var e = document.createEvent('TextEvent');
		e.initTextEvent('textInput', true, true, null, text, 'zh-CN');
		element.dispatchEvent(e);
		element.focus();
	}

	Communication.prototype.onEnter = function() {
		var element = document.activeElement;
		var e = document.createEvent('TextEvent');
		e.initTextEvent('textInput', true, true, null, "\n", 'zh-CN');
		element.dispatchEvent(e);
		element.focus();
	}

	Communication.prototype.onSelect = function() {
		var element = document.activeElement;
		element.focus();
		element.select();
	}
	// override the initialize function of Bobo
	Communication.prototype.initialize = function() {
		this.getInfo('config')['iconUrl'] = 'test1.png'
		// this.setInfo('priority', 2);
		this.setInfo('boboID', 'phone');
		this.setInfo('iconClass', 'fui-phone');
		this.setInfo('name', 'Contact Helper');
		this.setInfo('description', 'An amazing tool to sync phones, emails and addresses to your phone. It lets your make calls and send messages right away!');
		this.setInfo('type', 'generic');
		this.setController({
			url : 'http://rc1.demobo.com/v1/momos/communicationtool/control.html?0810',
			// url: 'http://10.0.0.24:1240/v1/momos/communicationtool/control.html?0810',
			orientation : 'portrait'
		});

		this.setInputEventHandlers({
			'demoboApp' : 'onReady',
			'typing-area' : 'insertTextAtCursor',
			'enter-button' : 'onEnter',
			'select-button' : 'onSelect'
		});
	};

	Communication.prototype.run = function() {
		var that = this;
		var target = document.querySelector('head > title');
		var observer = new window.WebKitMutationObserver(function(mutations) {
		    mutations.forEach(function(mutation) {
		    	that.demoboParser.apply(that, []);
		        console.log('new title:', mutation.target.textContent);
		    });
		});
		observer.observe(target, { subtree: true, characterData: true, childList: true });
		setTimeout(function(){
			that.pauseBobo.apply(that, []);
			that.demoboParser.apply(that, []);
		}, 1000);
	};

	Communication.prototype.demoboParser = function() {
		console.log('new parse');
		var that = this;
		var handler = new Tautologistics.NodeHtmlParser.HtmlBuilder(function(error, dom) {
			if (error) {

			} else {
				Communication.telephones = [];
				// soupselect happening here...
				//Communication.telephones = select(dom, '[itemprop=telephone]');
				var iframe = document.getElementById('demobo_overlay');

				if (Communication.telephones.length < 1) {
					traverse(dom, process);
					iframe.contentWindow.postMessage(Communication.telephones, '*');
					//iframe.contentWindow.postMessage(Communication.telephones, window.demoboBase);
				} else {
					iframe.contentWindow.postMessage(Communication.telephones[0].children, '*');
					Communication.telephones = Communication.telephones[0].children;
					//iframe.contentWindow.postMessage(Communication.telephones[0].children, window.demoboBase);
				}
				console.log("newParse", Communication.telephones);
			
				that.callFunction('onReceiveData', {
					title : document.title,
					data : Communication.telephones
				});
			}
			//}, { verbose: false, ignoreWhitespace: true });
		}, {
			ignoreWhitespace : true
		});
		//});
		var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
		parser.parseComplete(document.body.innerHTML);
		//console.log(JSON.stringify(handler.dom, null, 2));
		//that's all... no magic, no bloated framework

	};

	//called with every property and it's value
	process = function(type, title, data) {
    var telephone = { 
                type : type,
                title : title,
                data : data
              };
    Communication.telephones.push(telephone);
  }
  
  traverse = function(objects, func) {
        
    each(objects , function(index, object) {
      //console.log(JSON.stringify(object, null, " "));
      if (typeof(object.type)=="string") {
        if ((object.type) == "text") {
          phoneNumberParser(object, func);
          //addressParser(object, func);
          emailParser(object, func);
        }
      }
      
      if (typeof(object.children)=="object") {
        traverse(object.children,func);
      }
      
    });
    
  };
  
  phoneNumberParser = function(object, func) {
    var phase = object.data.trim();
    phase = phase.replace(new RegExp('zero', 'gi'), '0');
    phase = phase.replace(new RegExp('one', 'gi'), '1');
    phase = phase.replace(new RegExp('two', 'gi'), '2');
    phase = phase.replace(new RegExp('three', 'gi'), '3');
    phase = phase.replace(new RegExp('four', 'gi'), '4');
    phase = phase.replace(new RegExp('five', 'gi'), '5');
    phase = phase.replace(new RegExp('six', 'gi'), '6');
    phase = phase.replace(new RegExp('seven', 'gi'), '7');
    phase = phase.replace(new RegExp('eight', 'gi'), '8');
    phase = phase.replace(new RegExp('nine', 'gi'), '9');
    var pattern = /[\s]?(1\s*[-\/\.]?)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT])\.?\s*(\d+))*[\s\.]?/;
    var match = phase.match(pattern);
    //console.log(phase);
    if (match) {
      console.log(match);
      var data = match[0].trim().replace(/[^0-9]/g, '').replace(' ', '');
      var excludedPatterns = [/Posting ID:/, /.*@sale.craigslist.org/, /<!--/, /script/, /\{/];
      var i = 0;
      match = false;
      while ((!match) && (i<excludedPatterns.length)) {
        match = phase.match(excludedPatterns[i]);
        if (match) {
          console.log('excluded match', phase);
        }
        i++;
      }
      if (!match) {
        console.log('telephone matched', phase);
        func("telephone", phase, data);
      }
    }
  };
  
  addressParser = function(object, func) {
    var phase = object.data.trim();
    var pattern = /\s*((?:(?:\d+(?:\x20+\w+\.?)+(?:(?:\x20+STREET|ST|DRIVE|DR|AVENUE|AVE|ROAD|RD|LOOP|COURT|CT|CIRCLE|LANE|LN|BOULEVARD|BLVD)\.?)?)|(?:(?:P\.\x20?O\.|P\x20?O)\x20*Box\x20+\d+)|(?:General\x20+Delivery)|(?:C[\\\/]O\x20+(?:\w+\x20*)+))\,?\x20*(?:(?:(?:APT|BLDG|DEPT|FL|HNGR|LOT|PIER|RM|S(?:LIP|PC|T(?:E|OP))|TRLR|UNIT|\x23)\.?\x20*(?:[a-zA-Z0-9\-]+))|(?:BSMT|FRNT|LBBY|LOWR|OFC|PH|REAR|SIDE|UPPR))?)\,?\s+((?:(?:\d+(?:\x20+\w+\.?)+(?:(?:\x20+STREET|ST|DRIVE|DR|AVENUE|AVE|ROAD|RD|LOOP|COURT|CT|CIRCLE|LANE|LN|BOULEVARD|BLVD)\.?)?)|(?:(?:P\.\x20?O\.|P\x20?O)\x20*Box\x20+\d+)|(?:General\x20+Delivery)|(?:C[\\\/]O\x20+(?:\w+\x20*)+))\,?\x20*(?:(?:(?:APT|BLDG|DEPT|FL|HNGR|LOT|PIER|RM|S(?:LIP|PC|T(?:E|OP))|TRLR|UNIT|\x23)\.?\x20*(?:[a-zA-Z0-9\-]+))|(?:BSMT|FRNT|LBBY|LOWR|OFC|PH|REAR|SIDE|UPPR))?)?\,?\s+((?:[A-Za-z]+\x20*)+)\,\s+(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\s+(\d+(?:-\d+)?)\s*/;
    var match = phase.match(pattern);
    console.log(phase);
    if (match) {
      console.log(match);
      var data = match[0].trim();
      var excludedPatterns = [];
      var i = 0;
      match = false;
      while ((!match) && (i<excludedPatterns.length)) {
        match = phase.match(excludedPatterns[i]);
        if (match) {
          console.log('excluded match', phase);
        }
        i++;
      }
      if (!match) {
        console.log('address matched', phase);
        func("address", phase, data);
      }
    }
  };
  
  emailParser = function(object, func) {
    var phase = object.data.trim();
    var pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
    var match = phase.match(pattern);
    console.log(phase);
    if (match) {
      console.log(match);
      var data = match[0].trim();
      var excludedPatterns = [];
      var i = 0;
      match = false;
      while ((!match) && (i<excludedPatterns.length)) {
        match = phase.match(excludedPatterns[i]);
        if (match) {
          console.log('excluded match', phase);
        }
        i++;
      }
      if (!match) {
        console.log('email matched', phase);
        func("email", phase, data);
      }
    }  
  }
  
	each = function(objects, f) {
		for (var i = 0; i < objects.length; i++) {
			f(i, objects[i]);
		}
	};

	loadJS = function(src, f) {
		/* load and exec the script, code in f will be executed after this script is loaded
		 */

		var script;

		script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', src);
		script.className = 'demoboJS';
		document.body.appendChild(script);
		return script.onload = f;
	};

	loadCSS = function(src) {

		var link;

		link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', src);

		document.head.appendChild(link);
	};

	injectiframe = function(src, onloadHandler) {

		var div = document.createElement('div');
		div.setAttribute('id', 'demobo-widget');
		div.setAttribute('class', 'demobobarright');
		div.setAttribute('style', 'height: 188px; width: 332px;');

		iframe = document.createElement('iframe');
		iframe.setAttribute('id', 'demobo_overlay');
		iframe.setAttribute('src', src);
		iframe.setAttribute('scrolling', 'no');
		iframe.setAttribute('style', 'border: 1; overflow: hidden; height: 188px; width: 332px; display: none;');
		//iframe.setAttribute('style', 'opacity: 1; -webkit-transition: opacity 50ms linear; transition: opacity 50ms linear;position:fixed;bottom:0px;z-index:99999999;-webkit-transition-property: opacity, bottom;-webkit-transition-timing-function: linear, ease-out;-webkit-transition-duration: 0.3s, 0.3s;-webkit-transition-delay: initial, initial;border-color: rgba(0,0,0,0.298039);border-width: 1px;border-style: solid;box-shadow: rgba(0,0,0,0.298039) 0 3px 7px;');
		iframe.addEventListener('load', onloadHandler);

		div.appendChild(iframe);
		document.body.appendChild(div);
	};

	loadBoBo = function() {
		window.demoboPortal.addBobo(Communication);
	};

	responseToMessage = function(e) {
		//alert(e.data);
		var action = e.data.action;
		var data = e.data.data;
		if (action === 'phonecall') {
			var bizTelephoneValue = data.trim().replace(/[^0-9]/g, '').replace(' ', '');
			demobo.openPage({
				url : 'tel:' + bizTelephoneValue,
				title : 'Phone Call',
				message : 'Make a phone call to ' + bizTelephoneValue
			});
		} else if (action === 'sms') {
			var smsValue = data.trim().replace(/[^0-9]/g, '').replace(' ', '');
			demobo.openPage({
				url : 'sms:' + smsValue,
				title : 'Send SMS',
				message : 'Send a sms to ' + smsValue
			});
		}

	};

	loadJS(window.demoboBase + '/v1/bobos/phonebobo/libs/htmlparser.js', function() {
		loadJS(window.demoboBase + '/v1/bobos/phonebobo/libs/soupselect.js', function() {
			loadJS(window.demoboBase + '/v1/bobos/phonebobo/libs/porthole.js', function() {
				loadCSS(window.demoboBase + '/v1/bobos/phonebobo/css/bobo.css');
				injectiframe(window.demoboBase + '/v1/bobos/phonebobo/microdata.html', loadBoBo);
				window.addEventListener('message', responseToMessage, false);
			});
		});
	});

	// add this app to demoboPortal

})(); 