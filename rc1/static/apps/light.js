// (function() {
	var effectMode = 0;
	var stateEnable =true;
    var curState;
    var curPower=0;
    var oldPower=0;
    var beatCount = 0;
    buff=[[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
	ui = {
		name : 'light2',
		version : Math.random(),
  	playPauseButton: 	'#player_play_pause',
  	playButton: 		'#player_play_pause.play',
  	pauseButton: 		'#player_play_pause.pause',
  	nextButton: 		'#player_next',
  	previousButton: 	'#player_previous',
  	likeButton: 		'.queue-item.queue-item-active .smile:not(.active)',
  	dislikeButton:		'.queue-item.queue-item-active .frown',
  	volume:				'#volumeControl',
  	title: 				'',
  	artist: 			'',
  	album: 				'',
  	coverart:			'',
  	songTrigger: 		'#queue_list',
  	stationTrigger: 	'',
  	selectedStation:	'',
  	stationCollection:	'',
  	albumCollection:	'',
  	playlistTrigger: 	''
	};

	demoboBody.injectScript('//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function() {
		demoboBody.injectScript('https://cdn.firebase.com/v0/firebase.js', function() {
      		demoboBody.injectScript('http://localhost:1240/dev/LightConsole.js', function(){
 

			$(document).keydown(function(e) {
				if (e.which == 13) {
					effectMode = (effectMode+1)%2;
				}
			})
			  jQuery.noConflict();
			  if (DEMOBO) {
			  	DEMOBO.autoConnect = true;
			  	DEMOBO.init = init;
			  	demobo.start();
			  }
			  demoboLoading = undefined;

			  ui.controllerUrl = "http://rc1.demobo.com/v1/momos/" + ui.name + "/control.html?" + ui.version;
              // ui.controllerUrl = "http://10.0.0.17:1240/v1/momos/" + ui.name + "/control.html?" + ui.version;
			  ui.incomingCallCtrlUrl = "http://rc1.demobo.com/v1/momos/" + ui.name + "incoming" + "/control.html?" + ui.version;

			  // do all the iniations you need here
			  function init() {
				  	toggleLiveInput();
				  	demobo.setController({
				  		url : ui.controllerUrl,
				  		orientation: "portrait"
				  	});
				  	demobo.setController({
				  		'page' : 'wheel'
				  	}, "78435E83-AE4B-4D49-B258-964B7707E69B");
				  	
				  	// your custom demobo input event dispatcher
				  	demobo.mapInputEvents({
				  		'demoboApp' : onReady,
				  	});
                    var dpiAdjust = 0.79;
                    demobo.addEventListener('input',function(e) {
                        console.log(e);
                        var curtop = parseInt(e.value.top)*dpiAdjust;
                        var curleft= parseInt(e.value.left)*dpiAdjust;
                        var prevTop = parseInt(e.value.prevTop)*dpiAdjust;
                        var prevLeft= parseInt(e.value.prevLeft)*dpiAdjust;
                        var target = $(e.value.html).css('position', 'absolute').css('font-size', '33px');

                        console.log(target);
                        $('#iphoneDockScreen').append(target);

                        target.css({top:curtop, left:curleft, width: target.width()*dpiAdjust, height: target.height()*dpiAdjust});

                        var deltaTop = 10*(curtop-prevTop);
                        var deltaLeft = 10*(curleft-prevLeft);


					target.animate({
						top : "+=" + deltaTop + "px",
						left : "+=" + deltaLeft + "px"
					}, 500, function() {
						setTimeout(function() {
							target.hide('slow', function(){
								target.remove();
							})
						}, 10000)
					});
					//delete in 10 secs

                    },false);

				  	demobo.addEventListener("update", function(e) {
		            //transformation
		            var temp=e.z;
		            e.z = e.y;
		            e.y = temp;
                    e.y = -e.y;
                    buff.splice(0, 1)
                    if (Math.abs(e.x)+Math.abs(e.y)>3)
                        buff.push([e.x, e.y, e.z]);
                    else
                        buff.push([buff[3][0], buff[3][1], e.z]);
                    var x=0, y=0, z=0;
                    for (var i = 0; i<5; i++){
                        x = x+buff[i][0]/5.0;
                        y = y+buff[i][1]/5.0;
                        z = z+buff[i][2]/5.0;
                    }

                    var angles = dlc.getAngles(x,y,z);
                    dlc.setPan(angles[1]);
                    dlc.setTilt(angles[0]);
                    dlc.setDMX();
			  	});
			  	

		  	if (document.domain === 'grooveshark.com') setupSongTrigger();

          window.dlc = new window.LightConsole();
          initializeLiveMusicChanges();
			  }

        function setupSongTrigger() {
        		var triggerDelay = 100;
        		var trigger = jQuery('#np-meta-container')[0];
        		var _this = {
        			target : trigger,
        			oldValue : ''
        		};
        		_this.onChange = function() {
              if (!Grooveshark.getCurrentSongStatus().song) return;
        			var newValue = Grooveshark.getCurrentSongStatus().song.songName;
        			if (_this.oldValue !== newValue) {
        				_this.oldValue = newValue;
                		sendNowPlaying();
        			}
        		};
        		_this.delay = function() {
        			setTimeout(_this.onChange, triggerDelay);
        		};
        		_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
        
        }
        
        sendNowPlaying = function () {
        	demobo.callFunction('loadSongInfo', getNowPlayingData());
        	if (window.loadSongInfo) loadSongInfo(getNowPlayingData());
        };
        
        sendCurState = function () {
        	if (!curState || !stateEnable) return;
        	beatCount++;
			demobo.callFunction("syncState", curState);
			if (window.syncState) syncState(curState);
			dlc.setPattern(curState.pattern);
//			dlc.setGobo(0); //setGobo takes one param of value 0-14, of which 1-14 corresponds to 14 gobo shapes in goboShapes.bmp in Dropbox folder, and 0 is the default circle shape. Specifically, Index 1-7 are rotating gobos and index 8-14 are static gobos.
			dlc.setColor(curColor);
       		dlc.setDMX();
       		stateEnable = false;
       		setTimeout(function(){
       			stateEnable = true;
       		},200);
       		console.log(curState.color, effectMode);
        }
        
        getNowPlayingData = function () {
				var toReturn = [];
				if (window.Grooveshark) {
					var o = Grooveshark.getCurrentSongStatus().song;
				} else {
					var o = onstage;
				}
				if (!o) {
					return;
				}
				toReturn.push({
					'title' : o.songName||o.title,
					'artist' : o.artistName||o.artist,
					'album' : o.albumName||o.album,
					'image' : o.artURL||o.image,
					'mood' : o.mood||o.mood,
					'genre' : o.genre||o.genre,
				});
				return toReturn;
        };

			  function initializeLiveMusicChanges() {
			  		if (window.Grooveshark) return;
					//debugger
					var onStageRef = new Firebase('https://stage-lighting.firebaseio.com/livemusic/onstage');
					onStageRef.on('value', function(snapshot) {
						onstage = snapshot.val();

						if (onstage) {
							// console.log(onstage.artist);
							sendNowPlaying();
						}

					});
				}

        
			  // ********** custom event handler functions *************
			  function onReady() {
			  	sendNowPlaying();
			  	sendCurState();	
			  }
      		});
		});
	});
// })();


(function (global, exports, perf) {
  'use strict';

  function fixSetTarget(param) {
    if (!param)	// if NYI, just return
      return;
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime; 
  }

  if (window.hasOwnProperty('webkitAudioContext') && 
      !window.hasOwnProperty('AudioContext')) {
    window.AudioContext = webkitAudioContext;

    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
    AudioContext.prototype.createGain = function() { 
      var node = this.internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };

    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
    AudioContext.prototype.createDelay = function() { 
      var node = this.internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };

    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function() { 
      var node = this.internal_createBufferSource();
      if (!node.start) {
        node.start = function ( when, offset, duration ) {
          if ( offset || duration )
            this.noteGrainOn( when, offset, duration );
          else
            this.noteOn( when );
        }
      }
      if (!node.stop)
        node.stop = node.noteoff;
      fixSetTarget(node.playbackRate);
      return node;
    };

    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor = function() { 
      var node = this.internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };

    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
    AudioContext.prototype.createBiquadFilter = function() { 
      var node = this.internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };

    if (AudioContext.prototype.hasOwnProperty( 'createOscillator' )) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() { 
        var node = this.internal_createOscillator();
        if (!node.start)
          node.start = node.noteOn; 
        if (!node.stop)
          node.stop = node.noteOff;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }

    if (!AudioContext.prototype.hasOwnProperty('createGain'))
      AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    if (!AudioContext.prototype.hasOwnProperty('createDelay'))
      AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
      AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
  }
}(window));





var audioContext = new AudioContext();
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var detectorElem, 
	canvasElem,
	pitchElem,
	noteElem,
	detuneElem,
	detuneAmount;

window.onload = function() {

	detectorElem = document.getElementById( "detector" );
	canvasElem = document.getElementById( "output" );
	pitchElem = document.getElementById( "pitch" );
	noteElem = document.getElementById( "note" );
	detuneElem = document.getElementById( "detune" );
	detuneAmount = document.getElementById( "detune_amt" );

}

function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}

function error() {
    alert('Stream generation failed.');
}

function getUserMedia(dictionary, callback) {
    try {
        if (!navigator.getUserMedia)
        	navigator.getUserMedia = navigator.webkitGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
    // Create an AudioNode from the stream.
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    convertToMono( mediaStreamSource ).connect( analyser );
    updatePitch();
}

function toggleLiveInput() {
    getUserMedia({audio:true}, gotStream);
}

function togglePlayback() {
    var now = audioContext.currentTime;

    if (isPlaying) {
        //stop playing and return
        sourceNode.stop( now );
        sourceNode = null;
        analyser = null;
        isPlaying = false;
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
        window.cancelAnimationFrame( rafID );
        return "start";
    }

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = theBuffer;
    sourceNode.loop = true;

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    sourceNode.connect( analyser );
    analyser.connect( audioContext.destination );
    sourceNode.start( now );
    isPlaying = true;
    isLiveInput = false;
    updatePitch();

    return "stop";
}

var rafID = null;
var tracks = null;
var buflen = 1024;
var buf = new Uint8Array( buflen );
var MINVAL = 250; //134;  // 128 == zero.  MINVAL is the "minimum detected signal" level.

function findNextPositiveZeroCrossing( start ) {
	var i = Math.ceil( start );
	var last_zero = -1;
	// advance until we're zero or negative
	while (i<buflen && (buf[i] > 128 ) )
		i++;
	if (i>=buflen)
		return -1;

	// advance until we're above MINVAL, keeping track of last zero.
	while (i<buflen && ((t=buf[i]) < MINVAL )) {
		if (t >= 128) {
			if (last_zero == -1)
				last_zero = i;
		} else
			last_zero = -1;
		i++;
	}

	// we may have jumped over MINVAL in one sample.
	if (last_zero == -1)
		last_zero = i;

	if (i==buflen)	// We didn't find any more positive zero crossings
		return -1;

	// The first sample might be a zero.  If so, return it.
	if (last_zero == 0)
		return 0;

	// Otherwise, the zero might be between two values, so we need to scale it.

	var t = ( 128 - buf[last_zero-1] ) / (buf[last_zero] - buf[last_zero-1]);
	return last_zero+t;
}

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var colorNames =  ["red", "green", "blue", "pink", "yellow", "magenta", "red", "green", "blue", "pink", "yellow", "magenta"];
var colors = [
				{r:255 ,g: 0,b: 0}, 
				{r:0 ,g: 255,b: 0}, 
				{r:0 ,g: 0,b: 255}, 
				{r:255 ,g: 192,b: 203}, 
				{r:255 ,g: 255,b: 0}, 
				{r:255 ,g: 0,b: 255},
				{r:255 ,g: 0,b: 0}, 
				{r:0 ,g: 255,b: 0}, 
				{r:0 ,g: 0,b: 255}, 
				{r:255 ,g: 192,b: 203}, 
				{r:255 ,g: 255,b: 0}, 
				{r:255 ,g: 0,b: 255}
			];

function noteFromPitch( frequency ) {
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

function centsOffFromPitch( frequency, note ) {
	return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}

function updatePitch( time ) {
	var cycles = new Array;
	analyser.getByteTimeDomainData( buf );

	var i=0;
	// find the first point
	var last_zero = findNextPositiveZeroCrossing( 0 );

	var n=0;
	// keep finding points, adding cycle lengths to array
	while ( last_zero != -1) {
		var next_zero = findNextPositiveZeroCrossing( last_zero + 1 );
		if (next_zero > -1)
			cycles.push( next_zero - last_zero );
		last_zero = next_zero;

		n++;
		if (n>1000)
			break;
	}

	// 1?: average the array
	var num_cycles = cycles.length;
	var sum = 0;
	var pitch = 0;

	for (var i=0; i<num_cycles; i++) {
		sum += cycles[i];
	}

	if (num_cycles) {
		sum /= num_cycles;
		pitch = audioContext.sampleRate/sum;
	}

// confidence = num_cycles / num_possible_cycles = num_cycles / (audioContext.sampleRate/)
	var confidence = (num_cycles ? ((num_cycles/(pitch * buflen / audioContext.sampleRate)) * 100) : 0);

	// possible other approach to confidence: sort the array, take the median; go through the array and compute the average deviation

 	// detectorElem.className = (confidence>50)?"confident":"vague";
	// TODO: Paint confidence meter on canvasElem here.

 	if (num_cycles == 0) {
	 	// pitchElem.innerText = "--";
		// noteElem.innerText = "-";
		// detuneElem.className = "";
		// detuneAmount.innerText = "--";
 	} else {
 		// console.log( 
		// "Cycles: " + num_cycles + 
		// " - average length: " + sum + 
		// " - pitch: " + pitch + "Hz " +
		// " - note: " + noteFromPitch( pitch ) +
		// " - confidence: " + confidence + "% "
		// );
		
		var note =  noteFromPitch( pitch );
		if (effectMode==0) {
			oldPower = (note%12)/10;
			curPower = confidence/100;
			color = colors[note%12];
		} else if (effectMode==1) {
			oldPower = curPower;
			curPower = sum/80;
			color = colors[note%12];
		} else if (effectMode==2) {
			oldPower = sum/80;
			curPower = num_cycles/80;
			color = colors[note%12];
		}
		var pattern = Math.floor(beatCount/10)%5;
		curState = {
			isPlaying:true,
			curPower: curPower, //(note%12)/10,
			oldPower: oldPower, //num_cycles/100, //confidence/100,
			color: color,
			pattern : pattern,
			effectMode : effectMode
		};
		
		curColor = colorNames[note%12].toUpperCase();
		sendCurState();
		// console.log(num_cycles, sum, confidence, curColor);
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	rafID = window.requestAnimationFrame( updatePitch );
}

