define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require('famous/views/Scrollview');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var Utility = require('famous/utilities/Utility');

    var SettingView = require('views/SettingView');
    var TransitionDropdownView = require('views/TransitionDropdownView');
    var Slides = require('collections/Slides');
    var Slide = require('models/Slide');

    function TimerView() {
        View.apply(this, arguments);
        _createViews.call(this);
        _setListeners.call(this);
        _debug.call(this);
    }
    function _debug(){
        window.timerView = this;
    }


    TimerView.prototype = Object.create(View.prototype);
    TimerView.prototype.constructor = TimerView;

    TimerView.DEFAULT_OPTIONS = {
        size:[undefined,window.innerHeight]
    };

    function _createViews() {
        this.timerBackGround = new Surface({
            size: this.options.size,
            content: '<div id="timerView"><div id="clock-instruction">Tap to Start</div></div>'
        });
        this.add(this.timerBackGround);

        this.timer = new Surface({
            size: [window.innerWidth*0.8, 85],
            content: '<div id="clock">00:00</div>'
        });
//        this.add(this.timerMod).add(this.timer);
        var my_timer = new countUp(
            function() {
                $('#clock').text(padLeft(my_timer.time.m,2) + ":"+ padLeft(my_timer.time.s, 2));
            }
        );

        // transitionView
        this.transitionDropdownView = new TransitionDropdownView({
//            align: [0,0],
//            origin: [0,0]
        });
        // this.add(this.transitionDropdownView);


        // settingView button
        this.settingView = new SettingView({
            align: [0,0],
            origin: [0,0]
        });
        // this.add(this.settingView);

        this.timerBackGround.on('click', function(){
            this.transitionDropdownView.hide();
            this.settingView.hide();
//            my_timer.toggle();
        }.bind(this));

//        this.timer.on('dblclick', function(){
//            my_timer.set(0,0);
//        });

        this.resetHold = 0;
        this.repeat = function () {
            // initiate sound effect
            var doubleBeep = new Howl({
                urls: ['assets/audio/doubleBeep.mp3'],
                volume: 0.2
            });


            this.resetHold += 1;
//            console.log(this.resetHold);
            this.timeout = setTimeout(this.repeat, this.startDelete);
            this.startDelete = 400;
            if (this.resetHold == 4){
                if(setting.get('sound') === 'on')doubleBeep.play();
                my_timer.set(0,0);
            }
        }.bind(this);

        this.timer.on('click',function(){
            my_timer.toggle();
        }.bind(this));

        this.timer.on('touchstart', function(){
            this.transitionDropdownView.hide();
            this.settingView.hide();
            this.repeat();
        }.bind(this));

//        this.timer.on('touchcandel', function(){
//            clearTimeout(this.timeout);
//            if (this.resetHold < 4) my_timer.toggle();
//            this.resetHold = 0;
//        }.bind(this));

        this.timer.on('touchend', function(){
            if (this.timeout) clearTimeout(this.timeout);
//            if (this.resetHold < 4) my_timer.toggle();
            this.resetHold = 0;
        }.bind(this));

    }

    function countUp( fn_tick  ) {

        // initiate sound effect
        var beep = new Howl({
            urls: ['assets/audio/beep.mp3'],
            volume: 0.2
        });

        return {
            total_sec:0,
            running: false,
            timer: false,
            set: function(m,s) {
                this.total_sec = parseInt(m)*60+parseInt(s);
                this.time = {m:m,s:s};
                this.running = false;
                $('#clock-instruction').text('Tap to Start');
                fn_tick();
                return this;
            },
            toggle: function() {
                var self = this;
                if (!this.timer) {
                    this.timer = setInterval( function() {
                        if (self.running) {
                            self.total_sec++;
                            self.time = { m : parseInt(self.total_sec/60), s: (self.total_sec%60) };
                            fn_tick();
                        }
                    }, 1000 );
                }
                this.running = !this.running;
                if (this.running) {
                    // play sound effect
                    if(setting.get('sound') === 'on')beep.play();
                    $('#clock-instruction').text('Hold to Reset');
                } else {
                    $('#clock-instruction').text('Tap to Start');
                    if(setting.get('sound') === 'on')beep.play();
                    return this;
                }
            }
        };
    }

    function padLeft (number, length) {
        var result = number.toString();
        var pad = length - result.length;
        while(pad > 0) {
            result = '0' + result;
            pad--;
        }
        return result;
    }

    function _setListeners(){
        this.timer.pipe(this._eventOutput);
        this.timerBackGround.pipe(this._eventOutput);
        this.settingView.pipe(this._eventOutput);
        this.transitionDropdownView.pipe(this._eventOutput);
        this._eventOutput.on('closeSettingDropdown', function(){
//            console.log('closeSettingDropdown');
            this.settingView.hide();
        }.bind(this));
        this._eventOutput.on('closeTransitionDropdown', function(){
//            console.log('closeTransitionDropdown');
            this.transitionDropdownView.hide();
        }.bind(this));

        this.timerBackGround.on('click', function() {
            this._eventOutput.emit('open timerView');
        }.bind(this));


    }

    module.exports = TimerView;
});


