/** @define {boolean} */
var DEMOBO_DEBUG = false;
(function() {
	// Return if we have already run this.
	if (window['demobo']) {
		return;
	}
	// default demobo websocket behavior
	var demoboSettings = {
		open : function() {
		},
		close : function() {
		},
		message : function() {
		},
		options : {},
		events : {}
	};

	window['demobo'] = new function() {
		var _ws, _demoboBody, _qrID, _qrUrl;
		var _appID = Date.now();
		var _devices = {};
		var _p2ps = {};
		var _players = [];
		var _controllers = {};
		var _enable = false;
		/* ---------------
		 *  private methods 
		 * --------------- */
		// every de Mobo app has an app ID. currently it is using timestamp.
		this._getAppID = function() {
			return _appID;
		};
		// callback for checking if current app is the active 
		this._onSetActive = function(data) {
			if (data.appID == _appID) {
				demobo.enable();
			} else
				demobo.disable();
			if (DEMOBO_DEBUG) console.log("onSetActive " + demobo.isActive());
		};
		// set the current app as active
		this._setActive = function() {
			if (DEMOBO_DEBUG) console.log("setActive ");
			_enable = true;
			// TODO: fix consecutive send bug
			demobo._setP2P('', false);
			setTimeout(function(){
				demobo._send('broadcast', {
					type : 'setActive',
					appID : _appID
				});
			},100);
			return _enable;
		};
		
		this._getBrowser = function() {
			if (navigator.userAgent.match(/iPad/i))
				return 'ipad';
			if ((navigator.userAgent.toLowerCase().indexOf('chrome') != -1))
				return 'chrome';
			if ((navigator.userAgent.toLowerCase().indexOf('safari') != -1))
				return 'safari';
			return 'unknown';
		};
		this._createEvent = function(evtData) {
			var evt = document.createEvent("Event");
			evt.initEvent('phone_' + evtData.type, true, true);
			for ( var attrname in evtData) {
				if (!evt[attrname])
					evt[attrname] = evtData[attrname];
			}
			return evt;
		};
		this._extend = function(obj1, obj2) {
			var obj3 = {};
			for ( var attrname in obj1) {
				obj3[attrname] = obj1[attrname];
			}
			for ( var attrname in obj2) {
				obj3[attrname] = obj2[attrname];
			}
			return obj3;
		};
		this._deepExtend = function(obj1, obj2) {
			for ( var p in obj2) {
				try {
					// Property in destination object set; update its value.
					if (obj2[p].constructor == Object) {
						obj1[p] = MergeRecursive(obj1[p], obj2[p]);
					} else {
						obj1[p] = obj2[p];
					}
				} catch (e) {
					// Property in destination object not set; create it and set
					// its value.
					obj1[p] = obj2[p];
				}
			}
			return obj1;
		};
		this._getP2Ps = function() {
			return _p2ps;
		};
		this._setP2P = function(deviceID, enabled) {
			if (DEMOBO_DEBUG) console.log("demobo setP2P "+deviceID);
			if (!_enable)
				return;
			if (enabled)
				return demobo._sendPrivate('setP2P', {
					deviceID : deviceID,
					enabled : enabled
				});
			else
				return demobo._send('setP2P', {
					deviceID : deviceID,
					enabled : enabled
				});
		};
		this._connectP2P = function(e) {
			var deviceID = e.deviceID;
			var device = _devices[deviceID];
			if (DEMOBO_DEBUG) console.log("demobo connectP2P ",e,device);
			if (device) {
				if (DEMOBO_DEBUG) console.log("connectP2P with "+deviceID);
				if (device.address) {
					if (!_p2ps[device.address]) demobo._createP2P(device);
					else demobo._setP2P(device.deviceID, true);
				} 
			}
			if (!_enable)
				return;
			setTimeout(function() {demobo.setController(false, deviceID);},200);
		};
		this._createP2P = function(device) {
			if (DEMOBO_DEBUG) console.log("demobo _createP2P "+device.deviceID);
			var p2pws = new WebSocket('ws://' + device.address + ':12345/');
			p2pws.addEventListener("open", function() {
				if (demobo._setP2P(device.deviceID, true)) {
					_p2ps[device.address] = p2pws;
					_devices[device.deviceID] = device;
				}
			});
			p2pws.addEventListener("close", function() {
				if (_p2ps[device.address]) {
					delete _p2ps[device.address];
					delete _devices[device.deviceID];
					delete p2pws;
					// TODO: remoteWS disconnected event is still missing
					var evt = demobo._createEvent({type:'disconnected', deviceID: device.deviceID, address: device.address});
					window.dispatchEvent(evt);
					if (DEMOBO_DEBUG) console.log('reconnecting '+device.address);
					demobo._createP2P(device);
				}
			});
			p2pws.addEventListener("message", demobo._message);
		};
		this._close = function(e) {
			if (DEMOBO_DEBUG) console.log('reconnecting server');
			demobo.reconnect(5000);
		};
		this._message = function(e) {
			// if it is from simulator then it is ok
			if (this.url && !_enable)
				return;
			var receivedMsg = e.data.match(/{[^|]*}/g);
			if (!receivedMsg)
				return;
			for ( var i = 0; i < receivedMsg.length; i++) {
				var v = receivedMsg[i];
				var m = JSON.parse(v);
				var h = demoboSettings.events[m.type];
				if (h)
					h.call(this, m);
				else {
					var evt = demobo._createEvent(m);
					window.dispatchEvent(evt);
				}
			}
			if (DEMOBO_DEBUG) console.log("FROM: ",this.url,e.data);
		};
		this._send = function(type, data) {
			if (DEMOBO_DEBUG) console.log("send:", type, data, _enable);
			if (!_enable || !_ws)
				return false;
			var m = {};
			m.type = type;
			m.data = JSON.stringify(data);
			var msg = JSON.stringify(m);
			return _ws.send(msg);
		};
		this._sendPrivate = function(type, data) {
			if (DEMOBO_DEBUG) console.log("send private:", type, data, _enable);
			if (!_enable)
				return false;
			if (data.deviceID)
				return demobo._sendByDeviceID(type, data, data.deviceID);
			var ret = true;
			for ( var deviceID in _devices) {
				ret = ret && demobo._sendByDeviceID(type, data, deviceID);
			}
			return ret;
		};
		this._sendByDeviceID = function(type, data, deviceID) {
			if (!_enable)
				return false;
			var m = {};
			m.type = type;
			data.deviceID = deviceID;
			m.data = JSON.stringify(data);
			var msg = JSON.stringify(m);
			var ws = _ws;
			if (_devices[deviceID]) {
				var address = _devices[deviceID].address;
				var p2pws = _p2ps[address];
				if (p2pws)
					ws = p2pws;
			}
			if (DEMOBO_DEBUG) console.log("TO: " + ws.url, type);
			return ws.send(msg);
		};
		this._sendToSimulator = function(type, data) {
			if (!_demoboBody) return;
			var evt = new CustomEvent("FromFrontground", {detail: {type: type, data: data}});
			_demoboBody.dispatchEvent(evt);
		};
		this._guid = function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
					function(c) {
						var r = Math.random() * 16 | 0, v = c == 'x' ? r
								: (r & 0x3 | 0x8);
						return v.toString(16);
					});
		};
		this._getScript = function(url, func) {
			var script = document.createElement('script');
			script.async = "async";
			script.src = url;
			if (func) {
				script.onload = func;
			}
			document.head.insertBefore(script, document.head.firstChild);
		};
		this._urlParam = function(name) {
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			if (results)
				return results[1];
			return false;
		};
		this._isAllP2P = function() {
			var c = 0;
			for ( var deviceID in _devices) {
				c++;
			}
			var cc = 0;
			for ( var p2p in _p2ps) {
				cc++;
			}
			return c==cc;
		};

		/* public helper functions */
		this.start = function(config) {
			if (DEMOBO_DEBUG) console.log("demobo start");
			// stop start being called more than once
			if (DEMOBO.roomID) return;
			DEMOBO = demobo._extend(DEMOBO, config);
			// if ((navigator.userAgent.toLowerCase().indexOf('iphone') != -1)
				// || (navigator.userAgent.toLowerCase().indexOf('safari') == -1 
				// && navigator.userAgent.toLowerCase().indexOf('chrome') == -1)) {
				// this.renderBrowserWarning();
				// return;
			// }
			demobo.inputEventDispatcher = new demobo.InputEventDispatcher();
			if (DEMOBO.init) {
				demobo.setupShakeConnect();
				demobo._getScript("//net.demobo.com/guid.js", function(e) {
					if (demobo_guid) DEMOBO.roomID = demobo_guid;
					demobo.setup( {
						open : function() {
						if (DEMOBO.autoConnect) DEMOBO.init();
							// TODO: fix consecutive send bug
							demobo._setActive();
							setTimeout(function(){
								demobo.refreshDevices();
							},200);
							// ping every 60 sec to prevent sleep for now
							setInterval(function(){
								if (demobo.getState()!=1) demobo.reconnect();
								else demobo._send('','');
							},60000);
						}
					});
					if (DEMOBO.autoConnect) demobo.connect();
					else DEMOBO.init();
				});
			}
		};
		this.setup = function(s) {
			if (DEMOBO_DEBUG) console.log("demobo set up");
			if (typeof (DEMOBO) == "undefined") {
				this.renderDemoboWarning();
				return;
			}
			if (!s)
				s = DEMOBO.setting ? DEMOBO.setting : {};
			if (!DEMOBO.maxPlayers)
				DEMOBO.maxPlayers = 2;
			if (!DEMOBO.roomID) {
				if (s && s.roomID) {
					DEMOBO.roomID = s.roomID;
				} else if (DEMOBO.developer) {
					DEMOBO.roomID = this._guid();
				} else {
					this.renderDeveloperWarning();
					return;
				}
			}
			demoboSettings = demobo._extend(demoboSettings, s);
			demobo.enable();
			window.onunload = function() {
				if (_ws) {
					demobo.disconnect();
				}
			};
			// old style back button
			demobo.addEventListener('back', function(e) {
				if (parent.parent && parent.parent.closeGame)
					parent.parent.closeGame();
				else if (parent && parent.closeGame)
					parent.closeGame();
			}, false);
			// old style start button
			demobo.addEventListener('load', function(e) {
				demobo.setController(false, e.deviceID);
			}, false);
			demobo.addEventListener('connected', function(e) {
				if (DEMOBO.minAppVersion
						&& e.appVersion < DEMOBO.minAppVersion) {
					alert('Please update your de Mobo phone app. (min app version: ' + DEMOBO.minAppVersion + ')');
					return;
				}
				if (DEMOBO_DEBUG) console.log("connected", e);
				localStorage.isDemobo = true;
				demobo.hidePopup();
				var device = {
					address: e.address,	
					appVersion: e.appVersion,	
					deviceID : e.deviceID,
					deviceOS : e.deviceOS,
					latitude : e.latitude,
					longitude : e.longitude,
					userName: e.userName
				};
				// old version still don't have address in connected event, backward compatibility
				if (device.address) {
					_devices[device.deviceID] = device;
					// the new way is too fast, mobile server is not ready
					setTimeout(function(){demobo._connectP2P(device);},300);
				} else {
					demobo.refreshDevices(e.deviceID);
				}
			}, false);
			demobo.addEventListener('broadcast', function(e) {
				if (DEMOBO_DEBUG) console.log("broadcast: ", e.data);
				var broadcastData = JSON.parse(e.data);
				if (broadcastData.type=="setActive") {
					demobo._onSetActive(broadcastData);
				}
			}, false);
			demobo.addEventListener('getData', function(e) {
				if (e.appID && _appID != e.appID)
					return;
				if (DEMOBO_DEBUG) console.log("getData result: " + e.callback, e);
				// e.value is a string
				if (e.callback && e.value && e.value != "unknown")
					eval(e.callback)(JSON.parse(e.value), e.deviceID);
			}, false);
			demobo.addEventListener('getDeviceInfo', function(e) {
				if (DEMOBO_DEBUG) console.log("getDeviceInfo result: " + e.callback, e);
				if (_appID != e.appID)
					return;
				// e.value is an object
				// temp: android getDeviceInfo is not working for old
				// version
				var device = e.value || {
					deviceID : e.deviceID,
					deviceOS : "android"
				};
				_devices[device.deviceID] = device;
				if (e.callback && device)
					eval(e.callback)(device);
			}, false);
			demobo.addEventListener('input', function(e) {
				demobo.inputEventDispatcher.execCommand(e.source, e.value, e);
			});
			window.addEventListener('message', function(e) {
				// TODO: check e.source
				if (e.data && e.data.type) {
					demobo._message({data: JSON.stringify(e.data)});
				}
			});
			window.addEventListener('focus', function() {
				demobo._send('','');
				if (!demobo.isActive()) {
					// TODO: fix consecutive send bug
					demobo._setActive();
					setTimeout(function(){
						demobo.refreshDevices();
					},200);
				}
			});
			// set up simulator
			_demoboBody = document.getElementById('demoboBody');
		};
		this.renderBrowserWarning = function() {
			var message = 'We only support Safari and Chrome browsers at this moment.';
			alert(message);
		};
		this.renderDemoboWarning = function() {
			var message = 'de Mobo is undefined.';
			alert(message);
		};
		this.renderDeveloperWarning = function() {
			var message = 'Developers, please put your registered Google account name in DEMOBO.developer.';
			alert(message);
		};
		this.disable = function() {
			_enable = false;
		};
		this.enable = function() {
			_enable = true;
		};
		this.isActive = function() {
			return _enable;
		};
		this.connect = function() {
			if (_ws) return _ws;
			_ws = new WebSocket(DEMOBO.websocketServer + '?roomID=' + DEMOBO.roomID);
			_ws.addEventListener("open", demoboSettings.open);
			_ws.addEventListener("close", demoboSettings.close);
			_ws.addEventListener("message", demoboSettings.message);
			_ws.addEventListener("message", this._message);
			return _ws;
		};
		this.disconnect = function() {
			if (!_ws) return false;
			_ws.removeEventListener("open", demoboSettings.open);
			_ws.removeEventListener("close", demoboSettings.close);
			_ws.removeEventListener("message", demoboSettings.message);
			_ws.removeEventListener("message", this._message);
			_ws.close();
			_ws = null;
			return true;
		};
		this.reconnect = function(timeout) {
			if (!timeout) timeout = 1;
			setTimeout(function(){
				demobo.disconnect();
				demobo.connect();
			}, timeout);
		};
		this.simulateKeyEvent = function(character) {
			var canceled = !this.dispatchKeyboardEvent(document, 'keydown',
					true, true, // type, bubbles, cancelable
					null, // window
					character, // key
					0, // location: 0=standard, 1=left, 2=right, 3=numpad,
					// 4=mobile, 5=joystick
					''); // space-sparated Shift, Control, Alt, etc.
			this.dispatchKeyboardEvent(document, 'keypress', true, true, null,
					character, 0, '');
			this.dispatchKeyboardEvent(document, 'keyup', true, true, null,
					character, 0, '');
		};
		this.dispatchKeyboardEvent = function(target, initKeyboradEvent_args) {
			var e = document.createEvent("KeyboardEvents");
			e.initKeyboardEvent.apply(e, Array.prototype.slice.call(arguments,
					1));
			target.dispatchEvent(e);
		};
		this.getParameterByName = function(name) {
			var match = RegExp('[?&]' + name + '=([^&]*)').exec(
					window.location.search);
			return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
		};
		this.addPlayer = function(player) {
			if (_players.length < DEMOBO.maxPlayers
					&& _players.indexOf(player) == -1) {
				_players.push(player);
				return _players.length - 1;
			}
			return false;
		};
		this.getPlayerIndex = function(player) {
			return _players.indexOf(player);
		};
		this.getPlayers = function(player) {
			return _players;
		};
		
		/* sub classes */
		this.InputEventDispatcher = function() {
			if (DEMOBO_DEBUG) console.log("demobo InputEventDispatcher");
			this.acceptableCommands = {};
			this.addCommand = function(command, handler) {
				this.acceptableCommands[command] = handler;
			};
			this.addCommands = function(dict) {
				for ( var command in dict) {
					this.acceptableCommands[command] = dict[command];
				}
			};
			this.execCommand = function(command, data, event) {
				if (command in this.acceptableCommands) {
					this.acceptableCommands[command](data, event);
				}
			};
		};

		/* public API functions */
		this.getCurrentDomain = function() {
			var domainName = document.domain || window.location.hostname;
			var domainPart = domainName.split('.').reverse();
			domainName = domainPart[1] + '.' + domainPart[0];
			return domainName;
		};
		this.addEventListener = function(type, listener, useCapture) {
			var prefix = 'phone';
			window.addEventListener(prefix + '_' + type, listener, useCapture);
		};
		this.removeEventListener = function(type, listener, useCapture) {
			var prefix = 'phone';
			window.removeEventListener(prefix + '_' + type, listener,
					useCapture);
		};
		this.mapInputEvents = function(map) {
			demobo.inputEventDispatcher.addCommands(map);
		};
		this.getQRUrl = function() {
			if (!_qrUrl) {
				var setupData = JSON.stringify( {
					roomID : DEMOBO.roomID,
					server : DEMOBO.server,
					browser : demobo._getBrowser()
				});
				_qrUrl = "//chart.apis.google.com/chart?cht=qr&chl="+ escape(setupData) + "&chs=240x240";
			}
			return _qrUrl;
		};
		this.showPopup = function() {
			if (!_demoboBody) {
				_demoboBody = document.createElement('div');
				_demoboBody.setAttribute('id', 'demoboBody');
				document.body.appendChild(_demoboBody);
			}
			var demoboCover = document.getElementById('demoboCover');
			if (demoboCover) {
				demoboCover.style.display='block';
				return;
			}
			var id = 'demoboCover';
			var demoboCover = document.createElement('div');
			demoboCover.setAttribute('id', 'demoboCover');
			_demoboBody.appendChild(demoboCover);

			var demoboCoverDiv = document.createElement("div");
			demoboCoverDiv.setAttribute('id', 'demoboCoverDiv');
			demoboCover.appendChild(demoboCoverDiv);

			var div = document.createElement("div");
			div.setAttribute('id', 'demoboClose');
			demoboCoverDiv.appendChild(div);
			var a = document.createElement("a");
			a.setAttribute("onclick", "demobo.hidePopup();");
			newContent = document.createTextNode('✕');
			a.appendChild(newContent);
			div.appendChild(a);
			
			if (demobo.getState()!=1) {
				var div = document.createElement("div");
				div.appendChild(document.createTextNode('Failed to connect with de Mobo:'));
				demoboCoverDiv.appendChild(div);
				var div = document.createElement("div");
				div.appendChild(document.createTextNode('Unable to connect to the server. If you have a firewall, it may be blocking the connection.'));
				demoboCoverDiv.appendChild(div);
				demoboCover.style.opacity = 1;
			} else {
				demobo.renderQR('demoboCoverDiv', 1);
			}
		};

		this.hidePopup = function() {
			var demoboCover = document.getElementById('demoboCover');
			if (demoboCover) {
				demoboCover.style.display='none';
			}
		};
		this.setupShakeConnect = function() {
			var spaceBarCounter = 0;
			document.onkeydown = function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) {
					spaceBarCounter++;
					// 80 times is about 6.7 sec, first time is at about 1.2 sec
					if (spaceBarCounter%80==7) {
						demobo._getScript("//net.demobo.com/guid.js?"+Math.random());
					}
					// after holding start then recover from sleep
					if (spaceBarCounter==1) demobo._send('','');
				}
			};
			document.onkeyup = function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) {
					spaceBarCounter = 0;
				}
			};
		};
		this.renderQR = function(id, visible) {
			if (!id)
				id = 'qrcode';
			_qrID = id;
			// add QR
			if (!document.getElementById(id)) {
				var div = document.createElement("div");
				div.id = id;
				document.body.appendChild(div);
			}
			if (document.getElementById(id)) {
				if (!document.getElementById("qrimage")) {
					var img = document.createElement("img");
					img.id = "qrimage";
					img.src = demobo.getQRUrl();
					document.getElementById(id).appendChild(img);
					document.onkeyup = function(e) {
						var code = (e.keyCode ? e.keyCode : e.which);
						if (code == 13) {
						} // enter
						else if (code == 27) {
							if (document.getElementById(id).style.display == "none")
								document.getElementById(id).style.display = "block";
							else
								document.getElementById(id).style.display = "none";
						} // esc
					};
				}
				if (!visible)
					document.getElementById(id).style.display = "none";
				else
					document.getElementById(id).style.display = "block";
			}
		};
		this.getControllers = function() {
			return _controllers;
		};
		this.setController = function(controller, deviceID) {
			if (DEMOBO_DEBUG) console.log("demobo setController " + deviceID);
			if (!controller) {
				if (_controllers[deviceID])
					controller = _controllers[deviceID];
				else
					controller = _controllers[undefined];
			}
			controller = demobo._extend( {}, controller);
			demobo._sendToSimulator('register', controller);
			demobo._sendToSimulator('setData', {key: 'qrUrl', value: demobo.getQRUrl()});
			if (!_enable)
				return;
			if (typeof (controller.page) == "undefined" || !controller.page) {
				controller.page = "default";
				if (!controller.url)
					return false;
			}
			if (deviceID) {
				controller.deviceID = deviceID;
				_controllers[deviceID] = controller;
				return demobo._sendPrivate('register', controller);
			} else {
				// deviceID undefined = all devices
				delete controller.deviceID;
				_controllers[deviceID] = controller;
				return demobo._send('register', controller);
			}
		};
		this.fireEvent = function(evt) {
			if (!_enable)
				return;
			return demobo._sendPrivate('fireEvent', evt);
		};
		this.setData = function(deviceID, value) {
			if (DEMOBO_DEBUG) console.log("demobo setData " + deviceID);
			if (!_enable)
				return;
			return demobo._sendPrivate('setData', {
				deviceID : deviceID,
				appURL : DEMOBO.appName||window.location.host,
				value : JSON.stringify(value)
			});
		};
		this.getData = function(deviceID, callback) {
			if (DEMOBO_DEBUG) console.log("demobo getData " + deviceID + " " + callback);
			if (!_enable)
				return;
			return demobo._sendPrivate('getData', {
				deviceID : deviceID,
				appURL : DEMOBO.appName||window.location.host,
				appID : _appID,
				callback : callback
			});
		};
		this.getDeviceInfo = function(deviceID, callback) {
			if (DEMOBO_DEBUG) console.log("demobo getDeviceInfo " + deviceID);
			if (!_enable)
				return;
			return demobo._send('getDeviceInfo', {
				deviceID : deviceID || "",
				appID : _appID,
				callback : callback || ""
			});
		};
		this.setPage = function(page) {
			if (!_enable)
				return;
			if (!page)
				var page = {};
			return demobo._sendPrivate('setPage', page);
		};
		this.openPage = function(page) {
			if (!_enable)
				return;
			if (!page)
				var page = {};
			return demobo._sendPrivate('openPage', page);
		};
		this.setHTML = function(page, deviceID) {
			if (!_enable)
				return;
			if (!page)
				var page = {};
			if (_controllers[deviceID]) {
				_controllers[deviceID] = demobo._extend(_controllers[deviceID],
						page);
			}
			return demobo._sendPrivate('setHTML', page);
		};
		this.callFunction = function(functionName, data, deviceID) {
			demobo._sendToSimulator('callFunction', {functionName : functionName, data : data});
			if (!_enable)
				return;
			var functionData = {
				functionName : functionName,
				data : data
			};
			if (deviceID) functionData.deviceID = deviceID;
			demobo._sendPrivate('callFunction', functionData);
		};
		this.refreshDevices = function(deviceID) {
			if (DEMOBO_DEBUG) console.log("refreshDevices");
			if (deviceID)
				delete _devices[deviceID];
			else {
				for ( var id in _devices) {
					delete _devices[id];
				}
			}
			demobo.getDeviceInfo(deviceID, 'demobo._connectP2P');
			return;
		};
		this.getDevices = function() {
			return _devices;
		};
		this.getState = function() {
			var state = _ws ? _ws.readyState : -1;
			return state;
		};
	};

	// website rely on this to start demobo, bookmarklet needs to call this
	// specificly
	window.addEventListener('load', function() {
		demobo.start();
	}, false);

	var server = "net.demobo.com";
	window['DEMOBO'] = demobo._urlParam('demobo');

	if (DEMOBO) {
		DEMOBO = JSON.parse(decodeURIComponent(DEMOBO));
	} else {
		if (typeof (useremail) == "undefined") {
			useremail = "unknown";
		}
		DEMOBO = {
			useremail : useremail,
			server : server,
			websocketServer : "ws://" + server + ":8000",
			controller : false,
			autoConnect : true
		};
	}
})();