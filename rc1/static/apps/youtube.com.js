(function() {
var ui = {
	name: 				'youtube',
	version: 			'0130',
	songTrigger: 		'#interstitial',
	stationTrigger: 	'#film_strip',
	videoCollection:	'.related-video .yt-thumb-clip-inner',
	playlistTrigger: 	'',
	searchInput:		'input[type=text].search-term',
	searchSubmit:		'.search-button',
	player:				null,
	playerType:			null,
	isFullScreen: 		false
};
demoboBody.injectScript('//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function(){
	jQuery.noConflict();
	if (DEMOBO) {
		DEMOBO.autoConnect = true;
		DEMOBO.init = init;
		demobo.start();
	}
	demoboLoading = undefined;
	
	ui.controllerUrl = "http://rc1.demobo.com/rc/"+ui.name+"?"+ui.version;
	var curChannel = 0;
		
	if (document.getElementById("movie_player")) {
		ui.player = document.getElementById("movie_player");
		ui.playerType = "flash";
	} else if(document.getElementsByClassName("video-stream")[0]) {
		ui.player = document.getElementsByClassName("video-stream")[0];
		ui.playerType = "html5";
	}
	// do all the iniations you need here
	function init() {
		demobo.connect = function() {};
		demobo.disconnect = function() {};
		demoboBody.addEventListener("connectDemobo", function(e) {
			fullScreen();
		});
		demoboBody.addEventListener("disconnectDemobo", function(e) {
			regularScreen();
		});
		demobo._sendToSimulator('setData', {key: 'url', value: location.href});
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
			'volumeSlider' : 	setVolume,
			'playAlbum' :		playAlbum,
			'search':			search,
			'searchKeyword':	searchKeyword,
			'reloadButton':		reload,
			'channelUp':		next,
			'channelDown':		previous,
			'fullScreenButton':	toggleScreen,
			'vimeoButton':		vimeoButton,
			'demoboApp' : 		onReady,
			'demoboVolume' : 	onVolume
		});
		setupStateTrigger();
		setupVolume();
		if (localStorage.getItem('couchMode')!='false') fullScreen();
		setTimeout(onReady, 1000);
		setTimeout(onReady, 5000);
	}

	// ********** custom event handler functions *************
	function onReady() {
		sendStationList();
		sendNowPlaying();
		syncState();
	}
	function playPause() {
		if(ui.playerType == "flash") {
			if(ui.player.getPlayerState() == 1) {
				ui.player.pauseVideo();
			} else {
				ui.player.playVideo();
			}
		} else if(ui.playerType == "html5") {
			if(!ui.player.paused) {
				ui.player.pause();
			} else {
				ui.player.play();
			}
		}
	}
	function next() {
		playAlbum(0);
	}
	function previous() {
		history.back();
	}
	function rewind() {
		if (ui.playerType == "flash") {
			ui.player.seekTo(ui.player.getCurrentTime() - 5 > 0 ? ui.player.getCurrentTime() - 5 : 0, true);
		} else if(ui.playerType == "html5") {
			if(ui.player.currentTime - 5 > 0) {
				ui.player.currentTime -= 5;
			} else {
				ui.player.currentTime = 0;
			}
		}
	}
	function fastforward() {
		if (ui.playerType == "flash") {
			ui.player.seekTo(ui.player.getCurrentTime() + 5 < ui.player.getDuration() ? ui.player.getCurrentTime() + 5 : ui.player.getDuration(), true);
		} else if(ui.playerType == "html5") {
			if(ui.player.currentTime + 5 < ui.player.duration) {
				ui.player.currentTime += 5;
			} else {
				ui.player.currentTime = ui.player.duration;
			}
		}
	}
	function setVolume(num) {
		if (num>=0) localStorage.setItem('demoboVolume',num);
		else num = localStorage.getItem('demoboVolume')||50;
		num = Math.min(100,num);
		jQuery('#demoboVolume').show().html('<span width>VOL '+num+' </span>'+Array(Math.floor(parseInt(num)/5)+1).join("|")).stop().css('opacity',1).fadeTo(3000,0,function(){jQuery('#demoboVolume').hide()});
		num = num / 100;
		if(ui.playerType == "flash") {
			ui.player.setVolume(num*100);
		} else if(ui.playerType == "html5") {
			ui.player.volume = num;
		}
	}
	function getVolume() {
		if(ui.playerType == "flash") {
			return ui.player.getVolume();
		} else if(ui.playerType == "html5") {
			return parseInt(ui.player.volume*100);
		}
	}
	function onVolume(value) {
		if (value=='up') setVolume(parseInt(localStorage.getItem('demoboVolume'))+5);
		else if (value=='down') setVolume(parseInt(localStorage.getItem('demoboVolume'))-5);
		else setVolume(value*100);
	}
	function sendNowPlaying() {
		var nowplayingdata = getNowPlayingData();
		demobo.callFunction('loadSongInfo', nowplayingdata);
	}
	function playAlbum(index) {
		index = parseInt(index);
		if (jQuery('.video-list-item .related-video')[index]) {
			window.location = jQuery('.video-list-item .related-video')[index].href;
		} else {
			window.location = jQuery(jQuery('.context-data-item')[index]).find('a')[0].href;
		}
	}
	function search(keyword) {
		
	}
	function searchKeyword(keyword) {
		keyword = keyword.trim();
		if (!keyword) return;
		jQuery(ui.searchInput).val(keyword);
		setTimeout(function() {
			if (jQuery(ui.searchInput).val()) jQuery('#masthead-search')[0].submit();
		}, 200);
	}
	function reload() {
		location.reload();
	}
	function vimeoButton() {
		window.location = "http://vimeo.com/couchmode";
	}
	/* helpers */
	function setupStateTrigger() {
		if (!yt.config_.PLAYER_REFERENCE) return;
		yt.config_.PLAYER_REFERENCE.addEventListener("onStateChange", function(e){
			syncState();
			sendNowPlaying();
		});
	}
	function setupVolume() {
		jQuery('body').append('<div id="demoboVolume" style="position: fixed;width: 100%;margin: auto;bottom: 10%;left: 5%; color: #00adef;font-weight: bolder; font-size: 50px;z-index: 9999;padding: 30px 100px;"></div>');
		setVolume();
	}
	function getNowPlayingData() {
		if (!yt.config_.PLAYER_REFERENCE) return {title:'',artist:'',image:false};
		var data = yt.config_.PLAYER_REFERENCE.getVideoData();
		var imgURL = "http://i1.ytimg.com/vi/"+data.video_id+"/mqdefault.jpg";
		return {
			'title' : data.title,
			'artist' : '',
			'image' : imgURL
		};
	}

	function getVideoCollection() {
		var relatedVideo = jQuery('.video-list-item .related-video');
		if (relatedVideo.length) {
			var toReturn = [];
			jQuery.each(relatedVideo, function(index, elem) {
				var img = jQuery(elem).find('img').attr('data-thumb')?jQuery(elem).find('img').attr('data-thumb'):jQuery(elem).find('img').attr('src');
				var s = {
					title : jQuery(elem).find('.title').text().trim(),
					image: 	"http:"+img,
				};
				toReturn.push(s);
			});
		} else {
			var toReturn = [];
			jQuery.each(jQuery('.context-data-item'), function(index, elem) {
				if (!jQuery(elem).attr('data-context-item-title')) return;
				var img = jQuery(elem).find('img').attr('data-thumb')?jQuery(elem).find('img').attr('data-thumb'):jQuery(elem).find('img').attr('src');
				var s = {
					title : jQuery(elem).attr('data-context-item-title').trim(),
					image: 	"http:"+img,
				};
				toReturn.push(s);
			});
		}
		return toReturn;
	}

	function sendStationList() {
		demobo.callFunction('loadVideoCollection', getVideoCollection());
	}
	
	function syncState() {
		if (!yt.config_.PLAYER_REFERENCE) return;
		var isPlaying = yt.config_.PLAYER_REFERENCE.getPlayerState()==1;
		var state = {isPlaying: isPlaying, volume: getVolume()};
		demobo.callFunction('syncState', state);
	}
	
	function toggleScreen() {
		if (!ui.isFullScreen) fullScreen();
		else regularScreen();
	}
	
	function fullScreen() {
		if (!yt.config_.PLAYER_REFERENCE) return;
		jQuery('#watch7-video').css({position:'fixed',top:0,left:0,'z-index':9998,width:'100%',height:'100%'});
		jQuery('#watch7-player').css({width:'100%',height:'100%'});
		jQuery('body').css({overflow:'hidden'});
		ui.isFullScreen = true;
		demobo._sendToSimulator('setData', {key: 'autoConnect', value: true});
		localStorage.setItem('couchMode','true');
	}
	function regularScreen() {
		if (!yt.config_.PLAYER_REFERENCE) return;
		jQuery('#watch7-video').css({position:'',top:'',left:'','z-index':'',width:'',height:''});
		jQuery('#watch7-player').css({width:'',height:''});
		jQuery('body').css({overflow:''});
		ui.isFullScreen = false;
		demobo._sendToSimulator('setData', {key: 'autoConnect', value: false});
		localStorage.setItem('couchMode','false');
	}
	document.addEventListener("keyup", function(event) {
		if(event.which == 27) { // esc trigger toggleScreen
			toggleScreen();
		}
	}, true);
	ui.fullScreen = fullScreen;
	ui.regularScreen = regularScreen;
	ui.sendStationList = sendStationList;
});
})();
