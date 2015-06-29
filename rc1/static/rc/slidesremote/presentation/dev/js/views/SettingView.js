/*** SettingView ***/

define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var GridLayout = require("famous/views/GridLayout");
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');

    var Dropdown = require('controls/Dropdown');
    var Button = require('controls/Button');
    var Toggle = require('controls-base/Toggle');
    var ToggleIos = require('controls-ios/ToggleIos');
    var RadioButton = require('controls/RadioButton');

    var setting = require('configs/Setting');


    function SettingView() {
        View.apply(this, arguments);

        this.surfaces = [];
        this.isShown = false;
        this.rootModifier = new StateModifier();
        this.mainNode = this.add(this.rootModifier);

        _createDropdown.call(this);
        _setListeners.call(this);
    }

    SettingView.prototype = Object.create(View.prototype);
    SettingView.prototype.constructor = SettingView;

    SettingView.DEFAULT_OPTIONS = {
        menuSize: [(window.innerWidth/2)-20, window.innerHeight/15],
        fontSize: '20px',
        lineHeight: window.innerHeight/15 + 'px',
        align:[1,0],
        origin: [1,0]
    };

    SettingView.prototype.hide = function() {
        if (this.isShown == true) {
            if(setting.get('sound') === 'on')this.clickSound.play();
            this.isShown = false;
            this.triangleModifier.setOpacity(0);
            this.dropdown.toggle();
        }
    };

    function _createDropdown(options) {
        this.clickSound = new Howl({
            urls: ['assets/audio/bubble.mp3'],
            volume: 0.2
        });
        var opts = this.options;
        var dropdownView = new View();      // entire dropdown, button icon + dropdown menu
        var dropdownMenuView = new View();  // menu that gets displayed

        var grid = new GridLayout({
            dimensions: [2, 12]
        });
        grid.sequenceFrom(this.surfaces);

        // HEADER left
        this.row0l = new Surface ({
            content: 'Settings',
            size: this.options.menuSize,
            properties: {
                fontSize: this.options.fontSize,
                textAlign: 'left',
                paddingLeft: '20px',
                fontWeight: 'bold',
                lineHeight: '50px',
                margin: '0px 20px'
            }
        });
        this.surfaces.push(this.row0l);

        // HEADER right
        this.row0r = new Surface ({
            content: '',
            size: this.options.menuSize,
            properties: {
                textAlign: 'left',
                paddingRight: '20px',
                fontWeight: 'bold',
                lineHeight: this.options.lineHeight
            }
        });
        this.surfaces.push(this.row0r);

        // ROW 1 left
        this.row1l = new Surface ({
            content: 'Sound',
            size: this.options.menuSize,
            properties: {
                fontSize: this.options.fontSize,
                textAlign: 'left',
                lineHeight: this.options.lineHeight,
                paddingLeft: '20px',
                marginLeft: '20px',
                borderTop: '1px solid lightGray'
            }
        });
        this.surfaces.push(this.row1l);

        // ROW 1 right
        // create toggle button
        Toggle.registerSkin('ios', ToggleIos);
        if(setting.get('sound') === undefined) setting.save('sound', 'on');
        var options = {
            dot: {size: [22, 22]},
            tab: {size: [40, 25]},
            background: {size: [42, 26]},
            isSoundOn: setting.get('sound')
        };
        this.toggleSound = new Toggle('ios', options);

        var toggleSoundView = new View();
        var soundSurface = new Surface ({
            content: '',
            size: this.options.menuSize,
            properties: {
                borderTop: '1px solid lightGray',
                marginRight: '20px',
                textAlign:'left'
            }
        });

        var soundToggleModifier = new StateModifier({
            transform: Transform.translate(40,0,0)
        });

        var soundClickSurface = new Surface ({
            content: '',
            size: [32, 18]
        });
        var soundClickSurfaceModifier = new StateModifier({
            transform: Transform.translate(40,0,0),
            origin:[0.5,0.5]
        });

        toggleSoundView.add(soundSurface);
        toggleSoundView.add(soundToggleModifier).add(this.toggleSound);
        toggleSoundView.add(soundClickSurfaceModifier).add(soundClickSurface);
        this.surfaces.push(toggleSoundView);
        soundClickSurface.pipe(this.toggleSound);


        // ROW 2 left
        this.row2l = new Surface ({
            content: '<div id="disabledView">Text Animation</div>',
            size: this.options.menuSize,
            properties: {
                fontSize: this.options.fontSize,
                textAlign: 'left',
                borderTop: '1px solid lightGray',
                lineHeight: this.options.lineHeight,
                marginLeft: '20px'
            }
        });
//        this.surfaces.push(this.row2l);

        // ROW 2 right
        // create toggle button
        if(setting.get('animation') === undefined) setting.save('animation', 'off');
        Toggle.registerSkin('ios', ToggleIos);
        var options = {
            dot: {size: [22, 22]},
            tab: {size: [40, 25]},
            background: {size: [42, 26]},
            isAnimationOn: setting.get('animation')
            
        };
        this.toggleAnimation = new Toggle('ios', options);

        var toggleAnimationView = new View();
        var animationSurface = new Surface ({
            content: '',
            size: this.options.menuSize,
            properties: {
                borderTop: '1px solid lightGray'
            }
        });

        var animationToggleModifier = new StateModifier({
            transform: Transform.translate(40,0,0)
        });

        var animationClickSurface = new Surface ({
            content: '',
            size: [32, 18]
        });

        var animationClickSurfaceModifier = new StateModifier({
            transform: Transform.translate(40,0,4),
            origin:[0.5,0.5]
        });

        toggleAnimationView.add(animationToggleModifier).add(this.toggleAnimation);
        toggleAnimationView.add(animationSurface);
//        De-activates toggle
        toggleAnimationView.add(animationClickSurfaceModifier).add(animationClickSurface);
//        this.surfaces.push(toggleAnimationView);
//        animationClickSurface.pipe(this.toggleAnimation);


        // ROW 3 GRAY LEFT
        this.row3l = new Surface ({
            content: '',
            size: [(window.innerWidth/2), 35],
            properties: {
                textAlign: 'left',
                backgroundColor: '#e6e8ea '

            }
        });
        this.surfaces.push(this.row3l);

        // ROW 3 GRAY RIGHT
        this.row3r = new Surface ({
            content:'',
            size: [(window.innerWidth/2), 35],
            properties: {
                color: 'gray',
                textAlign: 'right',
                //lineHeight: '40px',
                backgroundColor: '#e6e8ea '

            }
        });
        this.surfaces.push(this.row3r);

        // ROW 4 left
        this.row4l = new Surface ({
            content: 'Legal',
            size: this.options.menuSize,
            properties: {
                fontSize: this.options.fontSize,
                borderBottom: '1px solid lightGray',
                textAlign: 'left',
                lineHeight: '30px',
                paddingLeft: '20px',
                marginLeft: '20px'
            }
        });
        this.surfaces.push(this.row4l);

        // ROW 4 right
        this.row4r = new Surface ({
            content:'<div class="fa fa-angle-right fa-lg"></div>',
            size: this.options.menuSize,
            properties: {
                color: 'gray',
                borderBottom: '1px solid lightGray',
                textAlign: 'right',
                lineHeight: '30px',
                paddingRight: '20px',
                marginRight: '20px'
            }
        });
        this.surfaces.push(this.row4r);

        //  ROW 5 left
        this.row5l = new Surface ({
            content: 'FAQ',
            size: this.options.menuSize,
            properties: {
                fontSize: this.options.fontSize,
                textAlign: 'left',
                lineHeight: this.options.lineHeight,
                paddingLeft: '20px',
                marginLeft: '20px'
            }
        });
        this.surfaces.push(this.row5l);

        // ROW 5 right
        this.row5r = new Surface ({
            content:'<div class="fa fa-angle-right fa-lg"></div>',
            size: this.options.menuSize,
            properties: {
                color: 'gray',
                textAlign: 'right',
                lineHeight: this.options.lineHeight,
                paddingRight: '20px',
                marginRight: '20px'
            }
        });
        this.surfaces.push(this.row5r);

        // ROW 6 GRAY left
        this.row6l = new Surface ({
            content: '',
            size: [(window.innerWidth/2), 35],
            properties: {
                textAlign: 'left',
                backgroundColor: '#e6e8ea '

            }
        });
        this.surfaces.push(this.row6l);

        // ROW 6 GRAY right
        this.row6r = new Surface ({
            content:'',
            size: [(window.innerWidth/2), 35],
            properties: {
                color: 'gray',
                textAlign: 'right',
                backgroundColor: '#e6e8ea '

            }
        });
        this.surfaces.push(this.row6r);

        // ROW 7 left
        this.row7l = new Surface ({
            content: 'Logout',
            size: this.options.menuSize,
            properties: {
                fontSize: this.options.fontSize,
                textAlign: 'left',
                paddingLeft: '20px',
                marginLeft: '20px',
                borderBottom: '1px solid lightGray'
            }
        });
        this.surfaces.push(this.row7l);

        // ROW 7 right
        this.row7r = new Surface ({
            content: '',
            size: this.options.menuSize,
            properties: {
                color: 'gray',
                textAlign: 'right',
                lineHeight: '35px',
                paddingRight: '20px',
                marginRight: '20px',
                borderBottom: '1px solid lightGray'
            }
        });
        this.surfaces.push(this.row7r);

        // ROW 8 left logo
        this.row8l = new ImageSurface ({
            content: 'assets/logo/2.png',
            size: [100, 100],
            properties: {
                textAlign: 'left',
                marginTop: '10px',
                marginLeft: window.innerWidth /2.75+'px'
            }
        });
        this.surfaces.push(this.row8l);

        // ROW 8 LOGO right empty space
        this.row8r = new Surface ({
            content:'',
            size: [(window.innerWidth/2), 35],
            properties: {
                textAlign: 'right'
            }
        });
        this.surfaces.push(this.row8r);

        // ROW 9 VERSION left
        this.row8l = new Surface ({
            content: 'VERSION 1.0.4',
            size: this.options.menuSize,
            properties: {
                textAlign: 'center',
                marginTop: '80px',
                marginLeft: window.innerWidth/3.5+'px'
            }
        });
        this.surfaces.push(this.row8l);
//        navigator.appInfo.getVersion(function(args){
//            this.row8l.setContent('VERSION ' + args);
//        }.bind(this))

        dropdownMenuView.add(grid);

        this.dropdown = new Dropdown({
            size: [window.innerWidth, window.innerHeight - 55],
            renderable: dropdownMenuView,
            origin: opts.origin,
            align: opts.align,
            baseTransform: Transform.translate(0,48, 2),
            renderableTransform: Transform.translate(0,0,2)
        });

        this.dropdownButton = new Surface({
            content:'<div class="fa fa-gear fa-2x"></div>',
            size: [45, 45],
            properties: {
                textAlign: 'center',
                lineHeight: '55px'
            }
        });

        var buttonModifier = new StateModifier({
            align: opts.align,
            origin: opts.origin,
            transform: Transform.translate(0,0,2.5)
        });

        this.dropdownButton.on('click', function() {
            this._eventOutput.emit('open timerView');

            if (this.isShown == false){
                this.dropdown.toggle();
                this.triangleModifier.setOpacity(1, {duration: 120});
                this.isShown = true;
                this._eventOutput.emit('closeTransitionDropdown');
            } else {
                this.dropdown.toggle();
                this.triangleModifier.setOpacity(0);
                this.isShown = false;
            }
            if(setting.get('sound') === 'on')this.clickSound.play();
        }.bind(this));

        var triangle = new Surface({
            content:'<div class="fa fa-caret-up fa-inverse fa-lg"></div>',
            size: [45, 15],
            properties: {
                textAlign: 'center'
            }
        });

        this.triangleModifier = new StateModifier({
            align: opts.align,
            origin: opts.origin,
            transform: Transform.translate(0,34,2),
            opacity: 0
        });

        dropdownView.add(this.triangleModifier).add(triangle);
        dropdownView.add(buttonModifier).add(this.dropdownButton);
        dropdownView.add(this.dropdown);
        this.mainNode.add(dropdownView);
    }

    function _setListeners() {

        // sound toggle
        (this.toggleSound).on('on', function(){
            console.log('soundOn');
            setting.save({sound: 'on'});
        }.bind(this));
        (this.toggleSound).on('off', function(){
            console.log('soundOff');
            setting.save({sound: 'off'});
        }.bind(this));

        // animation toggle
        (this.toggleAnimation).on('on', function(){
            console.log('animationOn');
            setting.save({animation: 'on'});
        }.bind(this));
        (this.toggleAnimation).on('off', function(){
            console.log('animationOff');
            setting.save({animation: 'off'});
        }.bind(this));

        // link to external websites
        (this.row4l).on('click', _loadLegalPage);
        (this.row4r).on('click', _loadLegalPage);

        (this.row5l).on('click', _loadHelpPage);
        (this.row5r).on('click', _loadHelpPage);

        (this.row7l).on('click', function() {
            this.dropdown.toggle();
            this.triangleModifier.setOpacity(0);
            this.isShown = false;
            this._eventOutput.emit('logout');
        }.bind(this));

        (this.row7r).on('click', function() {
            this.dropdown.toggle();
            this.triangleModifier.setOpacity(0);
            this.isShown = false;
            this._eventOutput.emit('logout');
        }.bind(this));

        //console.log( this.dropdownButton, this);
        this.dropdownButton.pipe(this._eventOutput);
    }

    function _loadHelpPage(){
        navigator.app.loadUrl('http://demobo.com/slides_faq.html', { openExternal:true });
    }

    function _loadLegalPage(){
        navigator.app.loadUrl('http://demobo.com/legal.html', { openExternal:true });

    }

    module.exports = SettingView;
});