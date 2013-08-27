(function() {
  var Vimeo = window.Bobo.extend();
	
  Vimeo.prototype.initialize = function(){
    this.setInfo('priority', 2);
    this.setInfo('iconClass', 'fui-play-circle');
    this.setInfo('boboID', 'vimeo');
    this.setInfo('name', 'Remote Control for vimeo');
    this.setInfo('description', 'This is a remote control for vimeo');
    this.setInfo('type', 'specific');


	  this.setInfo('ui', {
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
	  });
	  
    this.setInfo('curChannel', 0);
	

//		demobo._sendToSimulator('setData', {key: 'url', value: location.href});
//		if (!/couchmode/.test(location.pathname)) return;
		this.setController( {
			url : 'http://rc1.demobo.com/v1/momos/vimeo/control.html?0130',
			orientation: 'portrait'
		});
		// your custom demobo input event dispatcher
		this.setInputEventHandlers( {
			'playPauseButton' : 'playPause',
			'playButton' : 		  'playPause',
			'pauseButton' : 	  'playPause',
			'nextButton' : 		  'next',
			'previousButton' : 	'previous',
			'rewindButton' : 	  'rewind',
			'fastforwardButton':'fastforward',
			'loveButton' : 		  'like',
			'spamButton' : 		  'dislike',
			'volumeSlider' : 	  'setVolume',
			'stationItem' : 	  'chooseStation',
			'playAlbum' :		    'playAlbum',
			'staffPicks':		    'staffPicks',
			'search':			      'search',
			'searchKeyword':	  'searchKeyword',
			'reloadButton':		  'reload',
			'youtubeButton':	  'youtubeButton',
			'channelUp':		    'next',
			'channelDown':	    'previous',
			'menu':				      'toggleMenu',
			'upButton':			    'upButton',
			'downButton':		    'downButton',
			'leftButton':		    'leftButton',
			'rightButton':	    'rightButton',
			'okButton':			    'okButton',
			'demoboApp' : 	    'onReady',
			'demoboVolume' :  	'onVolume'
		});
		this.setupSongTrigger();
		this.setupStationTrigger();
		this.setupStateTrigger();
		this.setupVolume();
	};

	// ********** custom event handler functions *************
	Vimeo.prototype.onReady = function () {
		this.refreshController();
		this.syncState();
	};

	Vimeo.prototype.playPause = function () {
    var ui = this.getInfo('ui');
		$(ui.playPauseButton).click();
		$(ui.lightboxOverlay).click();
//		BigScreen.getVideo().play();
	};

	Vimeo.prototype.next = function () {
    var ui = this.getInfo('ui');
		$(ui.nextButton).click();
		$(ui.lightboxOverlay).click();
	};

	Vimeo.prototype.previous = function () {
    var ui = this.getInfo('ui');
		$(ui.previousButton).click();
		$(ui.lightboxOverlay).click();
	};

	Vimeo.prototype.rewind = function () {
    var ui = this.getInfo('ui');
		$(ui.rewindButton).click();
		$(ui.lightboxOverlay).click();
	};

	Vimeo.prototype.fastforward = function () {
    var ui = this.getInfo('ui');
		$(ui.fastforwardButton).click();
		$(ui.lightboxOverlay).click();
	};

	Vimeo.prototype.like = function () {
    var ui = this.getInfo('ui');
		$(ui.likeButton).click();
	};

	Vimeo.prototype.dislike = function () {
    var ui = this.getInfo('ui');
		$(ui.dislikeButton).click();
	};

	Vimeo.prototype.setVolume = function (num) {
		if (num>=0) localStorage.setItem('demoboVolume',num);
		else num = localStorage.getItem('demoboVolume')||50;
		num = Math.min(100,num);
		$('#demoboVolume').html('<span width>VOL '+num+' </span>'+Array(Math.floor(parseInt(num)/5)+1).join("|")).stop().css('opacity',1).fadeTo(3000,0);
		num = num / 100;
		BigScreen.getVideo().setVolume(num);
	};

	Vimeo.prototype.getVolume = function () {
		return parseInt(BigScreen.getVideo().volume*100);
	};

	Vimeo.prototype.onVolume = function (value) {
		if (value=='up') this.setVolume(this.getVolume()+5);
		else if (value=='down') this.setVolume(this.getVolume()-5);
		else this.setVolume(value*100);
	};

	Vimeo.prototype.sendNowPlaying = function () {
		var nowplayingdata = this.getNowPlayingData();
		if (!nowplayingdata)
			return;
		this.callFunction('loadSongInfo', nowplayingdata);
	};

	Vimeo.prototype.refreshController = function () {
    var vimeo = this;
		this.sendStationList();
		setTimeout(function(){vimeo.sendNowPlaying.apply(vimeo, [])},100);
	};

	Vimeo.prototype.playAlbum = function (index) {
    var ui = this.getInfo('ui');
		index = parseInt(index);
		$($(ui.videoCollection)[index]).click();
	};

	Vimeo.prototype.staffPicks = function () {
    var ui = this.getInfo('ui');
		$(ui.staffPicks).click();
	};

	Vimeo.prototype.search = function (keyword) {
		
	};

	Vimeo.prototype.searchKeyword = function (keyword) {
    var ui = this.getInfo('ui');
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
	};

	Vimeo.prototype.reload = function () {
		location.reload();
	};

	Vimeo.prototype.youtubeButton = function () {
		window.location="http://www.youtube.com";
	};

	Vimeo.prototype.toggleMenu = function (value) {
		if (value=='on') {
			if (CouchApplication.getCurrentMode()=="cinema_mode") callMenuMethod();
		} else {
			if (CouchApplication.getCurrentMode()=="browse_mode") callMenuMethod();
		}
	};

	Vimeo.prototype.upButton = function () {
		callUpMethod();
		this.toggleMenu('on');
	};

	Vimeo.prototype.downButton = function () {
		callDownMethod();
		this.toggleMenu('on');
	};

	Vimeo.prototype.leftButton = function () {
		callLeftMethod();
		this.toggleMenu('on');
	};

	Vimeo.prototype.rightButton = function () {
		callRightMethod();
		this.toggleMenu('on');
	};

	Vimeo.prototype.okButton = function () {
		callSelectMethod();
		this.toggleMenu('on');
	};
	/* helpers */
	Vimeo.prototype.setupSongTrigger = function () {
    var ui = this.getInfo('ui');
    var vimeo = this;
		var triggerDelay = 50;
		var trigger = $(ui.songTrigger)[0];
		var _this = {
			oldValue : $(ui.coverart).attr('src')+$(ui.title).text()+$(ui.artist).text()
		};
		var onChange = function() {
			var newValue = $(ui.coverart).attr('src')+$(ui.title).text()+$(ui.artist).text();
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				vimeo.refreshController.apply(vimeo, []);
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	Vimeo.prototype.setupStationTrigger = function () {
    var ui = this.getInfo('ui');
    var vimeo = this;
		var triggerDelay = 50;
		var trigger = $(ui.stationTrigger)[0];
		var _this = {
			oldValue : $($(ui.videoCollection + ' img')[0]).attr('alt')+$($(ui.videoCollection + ' img')[1]).attr('alt')
		};
		var onChange = function() {
			var newValue = $($(ui.videoCollection + ' img')[0]).attr('alt')+$($(ui.videoCollection + ' img')[1]).attr('alt');
			if (newValue && _this.oldValue !== newValue) {
				_this.oldValue = newValue;
				setTimeout(function(){ vimeo.sendStationList.apply(vimeo, [])}, 200);
			}
		};
		var delay = function() {
			setTimeout(onChange, triggerDelay);
		};
		if (trigger) trigger.addEventListener('DOMSubtreeModified', delay, false);
	};

	Vimeo.prototype.setupStateTrigger = function () {
    var ui = this.getInfo('ui');
    var vimeo = this;
		GlobalEventDispatcher.subscribe(FlideoEvent.PLAY, function(e){
			vimeo.syncState.apply(vimeo, []);
			$(ui.lightboxOverlay).click();
		});
		GlobalEventDispatcher.subscribe(FlideoEvent.PAUSE, function(e){
			vimeo.syncState.apply(vimeo, []);
			$(ui.lightboxOverlay).click();
		});
	};

	Vimeo.prototype.setupVolume = function () {
		$('#the_couch').append('<div id="demoboVolume" style="position: absolute;width: 100%;margin: auto;bottom: 0px;color: #00adef;font-size: 40px;z-index: 1000;padding: 30px 100px;"></div>');
		this.setVolume();
	};

	Vimeo.prototype.getNowPlayingData = function () {
    var ui = this.getInfo('ui');
		if (!$(ui.title).text()) return null;
		var imgURL = $(ui.coverart).attr('src');
		return {
			'title' : $(ui.title).text(),
			'artist' : $(ui.artist).text(),
			'image' : imgURL
		};
	};

	Vimeo.prototype.getStationList = function () {
    var ui = this.getInfo('ui');
		var toReturn = [];
		$.each($(ui.stationCollection), function(index,elem) {
			var s = {
				'title' : $(elem).text().trim()
			};
			if ($(elem).parent().hasClass('selected')) s.selected = true;
			toReturn.push(s);
		});
		return toReturn;
	};

	Vimeo.prototype.getVideoCollection = function () {
    var ui = this.getInfo('ui');
		var toReturn = [];
		$.each($(ui.videoCollection), function(index, elem) {
			var s = {
				title : $(elem).find('img').attr('alt').trim(),
				image: 	$(elem).find('img').attr('src'),
			};
			toReturn.push(s);
		});
		return toReturn;
	};
	
	Vimeo.prototype.chooseStation = function (index) {
    var ui = this.getInfo('ui');
		index = parseInt(index);
		$($(ui.stationCollection)[index]).click();
	};

	Vimeo.prototype.getCurrentStationIndex = function () {
    var ui = this.getInfo('ui');
		var toReturn = 0;
		$.each($(ui.stationCollection), function(index,elem) {
			if ($(elem).parent().hasClass('selected')) toReturn = index;
		});
		return toReturn;
	};

	Vimeo.prototype.sendStationList = function () {
		this.callFunction('loadVideoCollection', this.getVideoCollection());
	};
	
	Vimeo.prototype.syncState = function () {
		var state = {isPlaying: BigScreen.getVideo().playing, volume: this.getVolume()};
		this.callFunction('syncState', state);
	};
	
	Vimeo.prototype.getAbsPosition = function (element) {
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
	};

  window.demoboPortal.addBobo(Vimeo);
})();
