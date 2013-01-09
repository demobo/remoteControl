(function() {
	if (DEMOBO) {
		DEMOBO.autoConnect = true;
		DEMOBO.init = init;
		demobo.start();
	}
	demoboLoading = undefined;
	
	var ui = {
		name: 				'vimeo',
		version: 			'1120',
		playPauseButton: 	'.interactive_element.play_pause_button',
		playButton: 		'.interactive_element.play_pause_button:not(.playing)',
		pauseButton: 		'.interactive_element.play_pause_button.playing',
		nextButton: 		'.interactive_element.next_button',
		previousButton: 	'.interactive_element.previous_button',
		rewindButton: 		'.interactive_element.rewind_button',
		fastforwardButton: 	'.interactive_element.fast_forward_button',
		likeButton: 		'.interactive_element.like',
		dislikeButton:		'',
		volume:				'',
		title: 				'#interstitial .video h1 a',
		artist: 			'#interstitial .video h2 a',
		album: 				'',
		coverart: 			'#interstitial .video img.thumbnail',
		songTrigger: 		'#interstitial',
		stationTrigger: 	'#film_strip',
		selectedStation:	'',
		stationCollection:	'',
		videoCollection:	'.item_stream li a',
		playlistTrigger: 	'',
		staffPicks: 		'#nav_item_staffpicks',
		inbox:				'#nav_item_inbox',
		watchLater:			'#nav_item_watchlater',
		myStuff:			'#nav_item_my_stuff',
		likes:				'#context_item_likes',
		channels:			'#context_item_channels',
		searchLightbox:		'#search_lightbox',
		searchButton:		'#nav_item_search',
		searchInput:		'.search_input input[type=text]',
		searchSubmit:		'.search_input input[type=submit]',
		searchResult:		'.results_info a.interactive_element',
		lightboxOverlay:	'#lightbox_overlay'
	};
	ui.controllerUrl = "http://rc1.demobo.com/rc/"+ui.name+"?"+ui.version;
	var curChannel = 0;
	
	// do all the iniations you need here
	function init() {
		demobo._sendToSimulator('setData', {key: 'url', value: location.href});
		if (!/couchmode/.test(location.pathname)) return;
		demobo.setController( {
			url : ui.controllerUrl,
			orientation: 'portrait'
		});
		// your custom demobo input event dispatcher
		demobo.inputEventDispatcher.addCommands( {
			'playButton' : 		playPause,
			'pauseButton' : 	playPause,
			'nextButton' : 		next,
			'previousButton' : 	previous,
			'rewindButton' : 	rewind,
			'fastforwardButton':fastforward,
			'loveButton' : 		like,
			'spamButton' : 		dislike,
			'volumeSlider' : 	setVolume,
			'stationItem' : 	chooseStation,
			'playAlbum' :		playAlbum,
			'staffPicks':		staffPicks,
			'search':			search,
			'searchKeyword':	searchKeyword,
			'reloadButton':		reload,
			'youtubeButton':	youtubeButton,
			'channelUp':		next,
			'channelDown':		previous,
			'menu':				toggleMenu,
			'upButton':			upButton,
			'downButton':		downButton,
			'leftButton':		leftButton,
			'rightButton':		rightButton,
			'okButton':			okButton,
			'demoboApp' : 		onReady
		});
		setupSongTrigger();
		setupStationTrigger();
		setupStateTrigger();
		setupVolume();
	}

	// ********** custom event handler functions *************
	function onReady() {
		refreshController();
		hideDemobo();
		syncState();
	}
	function playPause() {
		$(ui.playPauseButton).click();
		$(ui.lightboxOverlay).click();
//		BigScreen.getVideo().play();
	}
	function next() {
		$(ui.nextButton).click();
		$(ui.lightboxOverlay).click();
	}
	function previous() {
		$(ui.previousButton).click();
		$(ui.lightboxOverlay).click();
	}
	function rewind() {
		$(ui.rewindButton).click();
		$(ui.lightboxOverlay).click();
	}
	function fastforward() {
		$(ui.fastforwardButton).click();
		$(ui.lightboxOverlay).click();
	}
	function like() {
		$(ui.likeButton).click();
	}
	function dislike() {
		$(ui.dislikeButton).click();
	}
	function setVolume(num) {
		if (num>=0) localStorage.setItem('demoboVolume',num);
		else num = localStorage.getItem('demoboVolume')||50;
		$('#demoboVolume').html('<span width>VOL '+num+' </span>'+Array(Math.floor(parseInt(num)/5)+1).join("|")).stop().css('opacity',1).fadeTo(3000,0);
		num = num / 100;
		BigScreen.getVideo().setVolume(num);
	}
	function sendNowPlaying() {
		var nowplayingdata = getNowPlayingData();
		if (!nowplayingdata)
			return;
		demobo.callFunction('loadSongInfo', nowplayingdata);
	}
	function refreshController() {
		sendStationList();
		setTimeout(sendNowPlaying,100);
	}
	function playAlbum(index) {
		index = parseInt(index);
		$($(ui.videoCollection)[index]).click();
	}
	function staffPicks() {
		$(ui.staffPicks).click();
	}
	function search(keyword) {
		
	}
	function searchKeyword(keyword) {
		keyword = keyword.trim();
		if (!keyword) return;
		$(ui.searchButton).click();
		$(ui.searchInput).val(keyword);
		setTimeout(function() {
			$(ui.searchSubmit).click();
			$(ui.searchResult).one('DOMSubtreeModified', function(e){
				setTimeout(function() {
					$(ui.searchResult).click();
					setTimeout(function(){
						$(ui.lightboxOverlay).click();
						$('#ottoman').blur();
					}, 100);
				},1000);
			});
			setTimeout(function(){
				$(ui.lightboxOverlay).click();
				$('#ottoman').blur();
			}, 2000);
		},500);
//		token = $("input[name=token]", "#search_form").val();
//        GlobalEventDispatcher.publish({type: LightboxEvent.HIDE_LIGHTBOX});
//        GlobalEventDispatcher.publish({type: SearchLightboxEvent.DISPLAY_RESULTS,stream: {section: "search",
//                context: f.val(),page: 1,sort: SortMethod.RELEVANT,user: null,search_term: keyword,token: token,items: n.items,total_items: n.total_items,current_item: null}});
//		CouchData.streams.browsing.search_term=keyword;
//		CouchData.streams.browsing.section = "search";
//		CouchData.streams.browsing.sort = "relevant";
//		CouchData.streams.browsing.token = token;
//		GlobalEventDispatcher.publish({type: CouchApplicationEvent.DATA_REFRESHED,couch_data: CouchData});
	}
	function reload() {
		location.reload();
	}
	function youtubeButton() {
		window.location="http://www.youtube.com";
	}
	function toggleMenu(value) {
		if (value=='on') {
			if (CouchApplication.getCurrentMode()=="cinema_mode") callMenuMethod();
		} else {
			if (CouchApplication.getCurrentMode()=="browse_mode") callMenuMethod();
		}
	}
	function upButton() {
		callUpMethod();
		toggleMenu('on');
	}
	function downButton() {
		callDownMethod();
		toggleMenu('on');
	}
	function leftButton() {
		callLeftMethod();
		toggleMenu('on');
	}
	function rightButton() {
		callRightMethod();
		toggleMenu('on');
	}
	function okButton() {
		callSelectMethod();
		toggleMenu('on');
	}
	/* helpers */
	function setupSongTrigger() {
		var triggerDelay = 50;
		var trigger = $(ui.songTrigger)[0];
		var _this = {
			oldValue : $(ui.coverart).attr('src')+$(ui.title).text()+$(ui.artist).text()
		};
		var onChange = function() {
			var newValue = $(ui.coverart).attr('src')+$(ui.title).text()+$(ui.artist).text();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				refreshController();
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	}
	function setupStationTrigger() {
		var triggerDelay = 50;
		var trigger = $(ui.stationTrigger)[0];
		var _this = {
			oldValue : $($(ui.videoCollection + ' img')[0]).attr('alt')+$($(ui.videoCollection + ' img')[1]).attr('alt')
		};
		var onChange = function() {
			var newValue = $($(ui.videoCollection + ' img')[0]).attr('alt')+$($(ui.videoCollection + ' img')[1]).attr('alt');
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				setTimeout(sendStationList, 200);
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	}
	function setupStateTrigger() {
		GlobalEventDispatcher.subscribe(FlideoEvent.PLAY, function(e){
			syncState();
			$(ui.lightboxOverlay).click();
		});
		GlobalEventDispatcher.subscribe(FlideoEvent.PAUSE, function(e){
			syncState();
			$(ui.lightboxOverlay).click();
		});
	}
	function setupVolume() {
		$('#the_couch').append('<div id="demoboVolume" style="position: absolute;width: 100%;margin: auto;bottom: 0px;color: #00adef;font-size: 40px;z-index: 1000;padding: 30px 100px;"></div>');
		setVolume();
	}
	function getNowPlayingData() {
		if (!$(ui.title).text()) return null;
		var imgURL = $(ui.coverart).attr('src');
		return {
			'title' : $(ui.title).text(),
			'artist' : $(ui.artist).text(),
			'image' : imgURL
		};
	}
	function getStationList() {
		var toReturn = [];
		$.each($(ui.stationCollection), function(index,elem) {
			var s = {
				'title' : $(elem).text().trim()
			};
			if ($(elem).parent().hasClass('selected')) s.selected = true;
			toReturn.push(s);
		});
		return toReturn;
	}

	function getVideoCollection() {
		var toReturn = [];
		$.each($(ui.videoCollection), function(index, elem) {
			var s = {
				title : $(elem).find('img').attr('alt').trim(),
				image: 	$(elem).find('img').attr('src'),
			};
			toReturn.push(s);
		});
		return toReturn;
	}
	
	function chooseStation(index) {
		index = parseInt(index);
		$($(ui.stationCollection)[index]).click();
	}

	function getCurrentStationIndex() {
		var toReturn = 0;
		$.each($(ui.stationCollection), function(index,elem) {
			if ($(elem).parent().hasClass('selected')) toReturn = index;
		});
		return toReturn;
	}

	function sendStationList() {
		demobo.callFunction('loadVideoCollection', getVideoCollection());
	}
	
	function syncState() {
		var state = {isPlaying: BigScreen.getVideo().playing, volume: parseInt(BigScreen.getVideo().volume*100)};
		demobo.callFunction('syncState', state);
	}
	
	function getAbsPosition(element) {
		if (element) {
			var oLeft = 0;
			var oTop = 0;
			var o = element;
			do {
				oLeft += o.offsetLeft;
				oTop += o.offsetTop;
			} while (o = o.offsetParent);
			return {
				'left' : oLeft,
				'top' : oTop
			};
		} else {
			return {};
		}
	}

})();