(function() {
	var ui = {
		name: 				'youtube',
		version: 			'0130',
		songTrigger: 		'#interstitial',
		stationTrigger: 	'#film_strip',
		videoCollection:	'.related-video .yt-thumb-clip-inner',
		playlistTrigger: 	'',
		searchInput:		'input[type=text]#headq',
		searchSubmit:		'#headSearchForm',
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
		
		// do all the iniations you need here
		function init() {
			ui.player = document.getElementById("demoboVideo");
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
			demobo.mapInputEvents( {
				'playPauseButton' : playPause,
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
			if (ui.player.paused) 
				ui.player.play(); 
			else 
				ui.player.pause(); 
		}
		function next() {
			playAlbum(0);
		}
		function previous() {
			history.back();
		}
		function rewind() {
			if(ui.player.currentTime - 5 > 0) {
				ui.player.currentTime -= 5;
			} else {
				ui.player.currentTime = 0;
			}
		}
		function fastforward() {
			if(ui.player.currentTime + 5 < ui.player.duration) {
				ui.player.currentTime += 5;
			} else {
				ui.player.currentTime = ui.player.duration;
			}
		}
		function setVolume(num) {
			if (num>=0) localStorage.setItem('demoboVolume',num);
			else num = localStorage.getItem('demoboVolume')||50;
			num = Math.min(100,num);
			jQuery('#demoboVolume').show().html('<span width>VOL '+num+' </span>'+Array(Math.floor(parseInt(num)/5)+1).join("|")).stop().css('opacity',1).fadeTo(3000,0,function(){jQuery('#demoboVolume').hide()});
			num = num / 100;
			ui.player.volume = num;
		}
		function getVolume() {
			return parseInt(ui.player.volume*100);
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
			window.location = jQuery(jQuery('.vRelated ul .v_link')[index]).find('a')[0].href;
		}
		function search(keyword) {
			
		}
		function searchKeyword(keyword) {
			keyword = keyword.trim();
			if (!keyword) return;
			jQuery(ui.searchInput).val(keyword);
			setTimeout(function() {
				if (jQuery(ui.searchInput).val()) jQuery(ui.searchSubmit)[0].submit();
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
			if (!ui.player) return;
			jQuery(ui.player).on("play pause", function(e){
				syncState();
				sendNowPlaying();
			});
		}
		function setupVolume() {
			jQuery('body').append('<div id="demoboVolume" style="position: fixed;width: 100%;margin: auto;bottom: 10%;left: 5%; color: #00adef;font-weight: bolder; font-size: 50px;z-index: 9999;padding: 30px 100px;"></div>');
			setVolume();
		}
		function getNowPlayingData() {
			if (!ui.player) return {title:'',artist:'',image:false};
			var imgURL = false; //"http://i1.ytimg.com/vi/"+data.video_id+"/mqdefault.jpg";
			return {
				'title' : jQuery('.base_info .title').text(),
				'artist' : '',
				'image' : imgURL
			};
		}

		function getVideoCollection() {
			var relatedVideo = jQuery('.vRelated ul');
			if (relatedVideo.length) {
				var toReturn = [];
				jQuery.each(relatedVideo, function(index, elem) {
					var img = jQuery(elem).find('.v_thumb img').attr('src');
					var s = {
						title : jQuery(elem).find('.v_title a').attr('title').trim(),
						image: 	img,
					};
					toReturn.push(s);
				});
			} else {
				var toReturn = [];
			}
			console.log(toReturn);
			return toReturn;
		}

		function sendStationList() {
			demobo.callFunction('loadVideoCollection', getVideoCollection());
		}
		
		function syncState() {
			if (!ui.player) return;
			var isPlaying = !ui.player.paused;
			var state = {isPlaying: isPlaying, volume: getVolume()};
			demobo.callFunction('syncState', state);
		}
		
		function toggleScreen() {
			if (!ui.isFullScreen) fullScreen();
			else regularScreen();
		}
		
		function fullScreen() {
			if (!ui.player) return;
			jQuery(ui.player).css({width:"100%",height:"100%",top:"0px",left:"0px"});
			ui.isFullScreen = true;
			demobo._sendToSimulator('setData', {key: 'autoConnect', value: true});
			localStorage.setItem('couchMode','true');
		}
		function regularScreen() {
			if (!ui.player) return;
			jQuery(ui.player).css({width:"",height:"",top:"110px",left:"30px"});
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
(function(){
	if(!/youku\.com/.test(window.location.href)){
		return false;
	}
	if(!window.videoId){
		return false;
	}
	var coverCss = [
		'',
		'position:fixed',
		'top:0',
		'left:0',
		'bottom:0',
		'right:0',
		'background-color:rgba(255,255,255,0)',
		'z-index:99',
		'pointer-events:none',
		''
	];
	var videoCss = [
		'',
		'position:absolute',
		'top:110px',
		'left:30px',
		'z-index:100',
		'background:#000',
		'box-shadow:0 0 5px #333',
		''
	];
	var aCss = [
		'',
		'position:absolute',
		'bottom:0',
		'left:0',
		'right:0',
		'height:30px;',
		'text-align:center',
		'font-size:14px',
		'pointer-events:auto',
		''
	];
	
	var btnCss = [
		'',
		'position:absolute',
		'top:0',
		'height:30px;',
		'line-height:30px',
		'width:60px',
		'text-align:center',
		'font-size:14px',
		'letter-spacing:-1px',
		'color:#014CCC',
		'cursor:pointer',
		'pointer-events:auto',
		'z-index:101',
		''
	];
	
	var HTML5Player = function(){
	
		var hd2Src= '/player/getM3U8/vid/'+videoId+'/type/hd2/ts/'+(((new Date()).getTime()/1000).toString()|0)+'/v.m3u8';
		var mp4Src= '/player/getM3U8/vid/'+videoId+'/type/mp4/ts/'+(((new Date()).getTime()/1000).toString()|0)+'/v.m3u8';
		var flvSrc= '/player/getM3U8/vid/'+videoId+'/type/flv/ts/'+(((new Date()).getTime()/1000).toString()|0)+'/v.m3u8';
		var mp4Src2 = 'http://3g.youku.com/pvs?id='+videoId2+'&format=3gphd';
		//var m3u8Src= '/player/getM3U8/vid/'+videoId+'/type/mp4/flv/ts/'+(new Date()).getTime()+'/v.m3u8';
		var cover = document.createElement('div');
		cover.style.cssText += coverCss.join(';');

		var v = document.createElement('video');
		v.setAttribute('id','demoboVideo');
		v.setAttribute('height','500');
		v.setAttribute('width','610');
		v.setAttribute('controls','true');
		v.setAttribute('autoplay','true');
		v.style.cssText += videoCss.join(';');
		v.src = mp4Src2;
		
		return {
			add : function(){
				document.body.appendChild(cover);
				document.body.appendChild(v);
				
				v.addEventListener('canplay',v.play);
				setTimeout(function(){
					cover.style.backgroundColor = 'rgba(255,255,255,0)';
				},100);
			},
			remove : function(){
				v.pause();
				cover.style.backgroundColor = 'rgba(255,255,255,0)';
				v.style.top = '-500px';
				setTimeout(function(){
					cover.parentNode && document.body.removeChild(cover);
					v.parentNode && document.body.removeChild(v);
				},1100);
			}
		}
	}

	var flashPlayer = function(){
		var flash = document.getElementById('movie_player');
		var flashOut = flash.parentNode;
		return {
			add : function(){
				flashOut.appendChild(flash);
			},
			remove : function(){
				flashOut.parentNode && flashOut.removeChild(flash);
			}
		}
	}	
	
	window.isYoukuHTML5PlayerBookMarkCodeByZythum = window.isYoukuHTML5PlayerBookMarkCodeByZythum || {};
	var y = window.isYoukuHTML5PlayerBookMarkCodeByZythum;
	y.HTML5  = y.HTML5 || HTML5Player();
	y.flash = y.flash || flashPlayer();
	y.flag = y.flag || false;
	if(y.flag === false){
		y.HTML5.add();
		y.flash.remove();
		y.flag = true;
	}else if(y.flag === true){
		y.HTML5.remove();
		y.flash.add();
		y.flag = false;
	}

})();