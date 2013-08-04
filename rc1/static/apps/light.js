(function() {
	var ui = {
		name : 'light2',
		version : '0723'
	};

	demoboBody.injectScript('//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function() {
		demoboBody.injectScript('https://cdn.firebase.com/v0/firebase.js', function() {
      demoboBody.injectScript('http://localhost:1240/dev/LightConsole.js', function(){
			  jQuery.noConflict();
			  if (DEMOBO) {
			  	DEMOBO.autoConnect = true;
			  	DEMOBO.init = init;
			  	demobo.start();
			  }
			  demoboLoading = undefined;

			  ui.controllerUrl = "http://rc1.demobo.com/v1/momos/" + ui.name + "/control.html?" + ui.version;
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
			  	}, "1FC0071B-44A9-4091-B3E7-32083D4DB5B6");
			  	
			  	// your custom demobo input event dispatcher
			  	demobo.mapInputEvents({
			  		'demoboApp' : onReady,
			  	});
			  	demobo.addEventListener("update", function(e) {
			  		console.log(e.x, e.y, e.z)
			  	});
			  	
			  	// var items = ["red", "blue", "white", "green", "pink", "yellow", "magenta"];
			  	// setInterval(function() {
			  		// demobo.callFunction("changeBackgroundColor", {
			  			// rgb : items[Math.floor(Math.random()*items.length)]
			  		// });
			  		// demobo.callFunction("changeForegroundColor", {
			  			// rgb : items[Math.floor(Math.random()*items.length)]
			  		// })
			  	// }, 1000);
          window.lc = new window.LightConsole();
          initializeLiveMusicChanges();
			  }

        function initializeLiveMusicChanges() {
          //debugger
          var onStageRef = new Firebase('https://stage-lighting.firebaseio.com/livemusic/onstage');
          onStageRef.on('value', function(snapshot) {
            var onstage = snapshot.val();
            
            if (onstage) {
              console.log(onstage.artist);
              
              demobo.callFunction("loadSongInfo",{
                  image : onstage.image,
                  title : onstage.title,
                  artist : onstage.artist,
                  album : onstage.album
              });
            }
                
          });
        }
        
			  // ********** custom event handler functions *************
			  function onReady() {
			  	demobo.callFunction('IncomingCallStatus', {
			  	});
			  }
      });
		});
	});
})();






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
var MINVAL = 170; //134;  // 128 == zero.  MINVAL is the "minimum detected signal" level.

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
var colors =  ["red", "green", "blue", "pink", "yellow", "magenta", "red", "green", "blue", "pink", "yellow", "magenta"];
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
 		console.log( 
		"Cycles: " + num_cycles + 
		" - average length: " + sum + 
		" - pitch: " + pitch + "Hz " +
		" - note: " + noteFromPitch( pitch ) +
		" - confidence: " + confidence + "% "
		);
		var note =  noteFromPitch( pitch );
		demobo.callFunction("syncState", {
			isPlaying:true,
			curPower:(note%12)/12,
			oldPower:confidence/100*5,
		});
		demobo.callFunction("changeColor", colors[note%12]);
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	rafID = window.requestAnimationFrame( updatePitch );
}
