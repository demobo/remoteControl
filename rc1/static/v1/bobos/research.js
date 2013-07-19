controller = {
    init: function() {
        this.pauseButton = document.getElementById('player_pause_button');
        this.nextButton = document.getElementById('player_skip_button');
        this.playButton = document.getElementById('player_play_button');
        //this.heartButton = document.getElementById('')
        if (!this.playButton) return false;
        
        document.body.addEventListener("DOMSubtreeModified", sendState);
        return true;
    },
    name: "8tracks",
    supports: {
        playpause: true,
        next: true,
        favorite: true
    },
    click: function(div) {
        fireEvent(div, 'click');
    },
    nextSong: function() {
        this.click(this.nextButton);
    },
    favorite: function() {
      this.click(document.querySelector('.like'));
    },
    play: function() {
        var button = this.isPlaying() ? this.pauseButton : this.playButton;
        this.click(button);
    },
    isPlaying: function() {
      return (this.pauseButton.style.display != "none");
    },
    lostFocus: function() {
      if (this.isPlaying()) this.play();
    },
    trackName: function() {
        return document.getElementsByClassName('title_artist')[0].getElementsByClassName('t')[0].innerText;
    },
    artistName: function() {
        return document.getElementsByClassName('title_artist')[0].getElementsByClassName('a')[0].innerText;
    },
    albumArt: function() {
        return document.getElementsByClassName('cover')[0].src;
    },
    getState: function() {
        var state = {};
        state.playing = this.isPlaying();
        state.title = this.trackName();
        state.artist = this.artistName();
        state.albumArt = this.albumArt();
        state.domainIcon = '8tracks.png';
        state.favorite = document.querySelector('.like').classList.contains('active');
       return state;
    }
}


controller = {
	    init: function() {
	        this.pause = document.getElementsByClassName("pauseButton")[0];	
	        this.next = document.getElementsByClassName("skipButton")[0];
	        this.thumbup = document.getElementsByClassName("thumbUpButton")[0];
	        this.thumbdown = document.getElementsByClassName("thumbDownButton")[0];
	        this.playButton = document.getElementsByClassName("playButton")[0];
	        if (!(this.playButton && this.next && this.thumbup && this.thumbdown)) return false;
	        document.body.addEventListener("DOMSubtreeModified", sendState);
	        this.playButton.addEventListener("click", function() {
	            setTimeout(sendState, 100);
	        });
	        return true;
	    },
	    name: "Pandora",
	    supports: {
	        playpause: true,
	        next: true,
	        thumbsup: true,
	        thumbsdown: true
	    },
	    nextSong: function() {
	        fireEvent(this.next, 'click');
	    },
	    thumbsUp: function() {
	        fireEvent(this.thumbup, 'click');
	    },
	    thumbsDown: function() {
	        fireEvent(this.thumbdown, 'click');
	    },
	    isPlaying: function() {
	      return this.pause.style.display == "block";
	    },
	    lostFocus: function() {
	      if (this.isPlaying()) this.play();
	    },
	    play: function() {
	        var button = this.isPlaying() ? this.pause : this.playButton;
	        fireEvent(button, 'click');
	    },
	    getState: function() {
	        var state = {};
	        state.playing = this.isPlaying();
	        state.thumbsUp = document.getElementsByClassName('thumbUpButton')[0].classList.contains('indicator');
	        state.thumbsDown = document.getElementsByClassName('thumbDownButton')[0].classList.contains('indicator');
	        state.title = document.getElementsByClassName('playerBarSong')[0].innerHTML;
	        state.artist = document.getElementsByClassName('playerBarArtist')[0].innerHTML;
	        state.albumArt = document.getElementsByClassName('playerBarArt')[0].src;
	        state.domainIcon = 'pandora.png';
	        state.collection = document.querySelector('.textWithArrow') && document.querySelector('.textWithArrow').innerText.trim();
	        return state;
	    }
	}
