if (top === self) {
	(function() {
		var ui = {
			name : 'berry',
			version : '0712'
		};

		var users = {
			"634FCA96-05A2-A7DB-2D6E-5BA7E5D50C9D" : "Jeff",
			"5EEF475B-DB67-CC9C-235E-C49D29F96594" : "Lap",
			"28BE7932-53F1-024F-063C-877712F6861F" : "Jiahao",
			"C116FD42-F2B5-EE59-17A6-78F40F22221F" : "Shawn"
		};

		var tones = {
			"634FCA96-05A2-A7DB-2D6E-5BA7E5D50C9D" : "Marimba",
			"5EEF475B-DB67-CC9C-235E-C49D29F96594" : "Doorbell",
			"28BE7932-53F1-024F-063C-877712F6861F" : "Sci-Fi",
			"C116FD42-F2B5-EE59-17A6-78F40F22221F" : "Timba"
		};

		var call = {

		};

		var callingList = [];

		demoboBody.injectScript('//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function() {
			demoboBody.injectScript('https://cdn.firebase.com/v0/firebase.js', function() {

				jQuery.noConflict();
				if (DEMOBO) {
					DEMOBO.autoConnect = true;
					DEMOBO.init = init;
					demobo.start();
				}

				demoboLoading = undefined;

				ui.controllerUrl = "http://rc1.demobo.com/rc/" + ui.name + "?" + ui.version;
				ui.incomingCallCtrlUrl = "http://rc1.demobo.com/rc/" + ui.name + "incoming" + "?" + ui.version;

				// do all the iniations you need here
				function init() {
					window.demobo_guid = "634FCA96-05A2-A7DB-2D6E-5BA7E5D50C9D";
					demobo._sendToSimulator('setData', {
						key : 'url',
						value : location.href
					});
					demobo.setController({
						url : ui.controllerUrl,
						orientation : 'portrait'
					});
					// your custom demobo input event dispatcher
					demobo.mapInputEvents({
						'demoboApp' : onReady,
						'outgoingCall' : outgoingCall,
						'acceptIncomingCall' : acceptIncomingCall,
						'declineIncomingCall' : declineIncomingCall,
						'gotoUrl' : gotoUrl
					});
					initializeIncomingCall();
					preloadRingtone();
				}

				// ********** custom event handler functions *************
				function onReady() {
					if (!window.call) {
						return;
					}
					var callerId = window.call.val()['name'];
					var caller = users[callerId];
					demobo.callFunction('IncomingCallStatus', {
						fromPerson : caller,
						fromSocial : "Facebook"
					});
				}

				var preloadRingtone = function() {
					if (document.getElementById('ringtone'))
						return;
					var e = document.createElement('video');
					e.controls = true;
					e.id = 'ringtone';
					e.loop = true;
					e.style.display = 'none';
					e.innerHTML = '<source src="//rc1-dot-de-mobo.appspot.com/audio/' + tones[window.demobo_guid] + '.mp3" type="audio/mpeg">';
					document.body.appendChild(e);
				};

				var stopRingtone = function() {
					var e = document.getElementById('ringtone');
					e && (e.pause() || (e.currentTime = 0));
				};
				var startRingtone = function() {
					var e = document.getElementById('ringtone');
					e && e.play();
				};
				// var injectVideoChat = function(roomId){
				// if (document.getElementById('videoChatFrame')) return;
				// var i = document.createElement('iframe');
				// i.src='https://apprtc.appspot.com/?r=' + roomId;
				// i.id='videoChatFrame';
				// i.style.position='fixed';
				// i.style.bottom='0px';
				// i.style.height='200px';
				// i.style.right='0px';
				// document.body.appendChild(i);
				// };

				var injectVideoChat = function(roomId) {
					if (!document.getElementById('chatContainer')) {
						var e = document.createElement('div');
						e.id = 'chatContainer';
						e.style.position = 'fixed';
						e.style.bottom = '0px';
						e.style.right = '0px';
						e.style.zIndex = '999';
						document.body.appendChild(e);
					}
					var i = document.createElement('iframe');
					// i.src = 'https://apprtc.appspot.com/?r=' + roomId;
					i.src = 'https://koalabearate.appspot.com/?r=' + roomId;
					i.className = 'videoChatFrame';
					i.id = roomId;
					i.style.width = '200px';
					document.getElementById('chatContainer').appendChild(i);
				};

				function initializeIncomingCall() {
					//debugger
					var incomingId = demobo_guid;
					var incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + incomingId);
					incomingCallRef.on('child_added', function(snapshot) {
						//debugger

						demobo.setController({
							url : ui.incomingCallCtrlUrl,
							orientation : 'portrait'
						});

						startRingtone();
						window.onIncomingCall();
						window.call = snapshot;
					});

					var shareWebPageRef = new Firebase('https://de-berry.firebaseio-demo.com/webpage/' + demobo_guid);
					shareWebPageRef.on('child_added', function(snapshot) {
						var url = snapshot.val()['url'];
						shareWebPageRef.remove();
						openURL(url);
					});
				}

				function gotoUrl(url) {
					if (users !== undefined) {
						jQuery.each(Object.keys(users), function(index, value) {
							var shareWebPageRef = new Firebase('https://de-berry.firebaseio-demo.com/webpage/' + value);
							shareWebPageRef.push({
								name : demobo_guid,
								url : url
							});
						});
					}
				}

				function acceptIncomingCall() {
					demobo.setController({
						url : ui.controllerUrl,
						orientation : 'portrait'
					});

					var incomingId = demobo_guid;
					var incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + incomingId);

					if (callingList.indexOf(window.call.val()['name']) < 0) {
						callingList.push(window.call.val()['name']);
					}

					//debugger
					incomingCallRef.remove();
					window.stopIncomingCall();
					stopRingtone();
					var roomId = window.call.name();
					injectVideoChat(roomId);

					if (window.call.val()['callinglist'].length > 0) {
						jQuery.each(window.call.val()['callinglist'], function(index, value) {
							if (value !== demobo_guid) {
								var groupOutgoingId = value;
								outgoingCall(groupOutgoingId);
							}
						});
					}
				}

				function declineIncomingCall() {
					demobo.setController({
						url : ui.controllerUrl,
						orientation : 'portrait'
					});

					var incomingId = demobo_guid;
					var incomingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + incomingId);
					//debugger
					incomingCallRef.remove();
					window.stopIncomingCall();
					stopRingtone();
					//injectVideoChat();
				}

				function outgoingCall(outgoingId) {
					//debugger
					callingList.push(outgoingId);
					window.onOutgoingCall();
					var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + outgoingId);
					outgoingCallRef.push({
						name : demobo_guid,
						callinglist : callingList
					});

					outgoingCallRef.on('child_removed', function(snapshot) {
						//debugger
						var callerId = snapshot.val()['name'];
						if (callerId === demobo_guid) {
							injectVideoChat(snapshot.name());
						}
						window.stopOutgoingCall();

					});

					// jQuery.each(callingList, function(index, value) {
					// debugger
					// var outgoingCallRef = new Firebase('https://de-berry.firebaseio-demo.com/' + value);
					// outgoingCallRef.push({name: demobo_guid, callinglist: callingList });
					//
					// outgoingCallRef.on('child_removed', function(snapshot) {
					// //debugger
					// //var userName = snapshot.name(), userData = snapshot.val();
					// window.stopOutgoingCall();
					// injectVideoChat(snapshot.name());
					// });
					// });
				}

				var openURL = function(url) {
					if (document.getElementById('berryFrame')) {
						document.getElementById('berryFrame').src = url;
						return;
					}
					var e = document.createElement('iframe');
					e.src = url;
					e.id = 'berryFrame';
					e.style.position = 'absolute';
					e.style.height = '100%';
					e.style.width = '100%';
					e.style.left = '0px';
					e.style.border = 'none';
					e.style.top = '0px';
					deleteWebContent();
					document.body.appendChild(e);
				};

				var deleteWebContent = function() {
					var parent = document.body;
					var children = parent.childNodes;
					var l = children.length;
					var i = 0;
					while (i < l) {
						if (children[0].id === 'demoboBody') {
							return;
						}
						parent.removeChild(children[0]);
						i = i + 1;
					}
				};

				var incomingBlinkInt;
				window.onIncomingCall = function() {
					var autoConnect = false;
					incomingBlinkInt = setInterval(function() {
						demobo._sendToSimulator('setData', {
							key : 'autoConnect',
							value : autoConnect
						});
						autoConnect = !autoConnect;
					}, 500);
				};
				window.stopIncomingCall = function() {
					if (incomingBlinkInt)
						clearInterval(incomingBlinkInt);
					demobo._sendToSimulator('setData', {
						key : 'autoConnect',
						value : 'false'
					});
				};

				var outgoingBlinkInt;
				window.onOutgoingCall = function() {
					var autoConnect = false;
					outgoingBlinkInt = setInterval(function() {
						demobo._sendToSimulator('setData', {
							key : 'autoConnect',
							value : autoConnect
						});
						autoConnect = !autoConnect;
					}, 1000);
				};
				window.stopOutgoingCall = function() {
					if (outgoingBlinkInt)
						clearInterval(outgoingBlinkInt);
					demobo._sendToSimulator('setData', {
						key : 'autoConnect',
						value : 'false'
					});
				};

				window.outgoingCall = outgoingCall;
				window.acceptIncomingCall = acceptIncomingCall;
				window.call = call;
				window.deleteWebContent = deleteWebContent;
				window.openURL = openURL;
				window.injectVideoChat = injectVideoChat;
			});
		});
	})();
} else {
	// (function() {
		var ui = {
			name : 'slideshare',
			version : '0201',
			nextButton : '.btnNext',
			previousButton : '.btnPrevious',
			firstButton : '.btnFirst',
			lastButton : '.btnLast',
			pageNumber : '.goToSlideLabel input',
			currentNote : '.commentsNotes .slide-notes:visible',
			notes : '#notesList li',
			pageCount : '.goToSlideLabel span',
			pageTrigger : '.player'
		};
		slideChangeTimeout = null;

		// do all the iniations you need here
		function init() {
			if ( typeof player == 'undefined')
				return;
			setupPageTrigger();
			addEventListener("message", function(evt){
				console.log(evt.data);
				var cmd = JSON.parse(evt.data);
				if (cmd.action=="setCurrentPage") {
					_setSlide(cmd.data);
				}
			}, false);
		}
		init();
		// ********** custom event handler functions *************

		function next() {
			_setSlide(getCurrentPageNumber() + 1);
			//		$(ui.nextButton).click();
		}

		function previous() {
			_setSlide(getCurrentPageNumber() - 1);
			//		$(ui.previousButton).click();
		}

		function firstSlide() {
			$(ui.firstButton).click();
		}

		function lastSlide() {
			$(ui.lastButton).click();
		}

		function setSlide(num) {
			if (slideChangeTimeout)
				clearTimeout(slideChangeTimeout);
			slideChangeTimeout = setTimeout(function() {
				_setSlide(num);
				slideChangeTimeout = null;
			}, 100);
		}

		function _setSlide(num) {
			if (player.controller)
				player.controller.play(num);
			else
				player.jumpTo(num);
		}

		function onVolume(value) {
			if (value == 'up')
				next();
			else if (value == 'down')
				previous();
		}

		/* helpers */
		function setupPageTrigger() {
			var triggerDelay = 50;
			if (player.controller)
				var trigger = $(ui.pageTrigger)[0];
			else
				var trigger = $('body')[0];
			var _this = {
				oldValue : getCurrentPageNumber()
			};
			var onChange = function() {
				var newValue = getCurrentPageNumber();
				if (newValue && _this.oldValue !== newValue) {
					_this.oldValue = newValue;
					setCurrentPage(newValue);
				}
			};
			var delay = function() {
				setTimeout(onChange, triggerDelay);
			};
			if (trigger)
				trigger.addEventListener('DOMSubtreeModified', delay, false);
		}

		function loadNotes() {
			// demobo.callFunction('loadNotes', getNotes());
		}

		function setCurrentPage(num) {
			console.log("setCurrentPage :"+num);
			// demobo.callFunction('setCurrentPage', num);
			if (parent.window.$(".videoChatFrame")[0])
				parent.window.$(".videoChatFrame")[0].contentWindow.postMessage(JSON.stringify({action:"setCurrentPage", data: num}),"*");
		}

		function getCurrentPageNumber() {
			if (player.controller)
				return parseInt(player.controller.currentPosition);
			else
				return player.getCurrentSlide();
		}

		function getPageCount() {
			if (player.controller)
				return player.controller.slideCount;
			else
				return slideshare_object.totalSlides;
		}

		function getNotes() {
			var toReturn = [];
			if ($(ui.notes).length) {
				var pageCount = getPageCount();
				for (var i = 0; i < pageCount; i++) {
					var note = $($(ui.notes)[i]).html();
					if (!note)
						note = "";
					var s = {
						'note' : note
					};
					toReturn.push(s);
				}
			}
			return toReturn;
		}

	// })();
}
