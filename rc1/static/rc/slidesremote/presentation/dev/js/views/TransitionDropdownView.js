/*** DropdownView ***/

define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var GridLayout = require("famous/views/GridLayout");
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var SequentialLayout = require("famous/views/SequentialLayout");
    var Easing = require('famous/transitions/Easing');

    var Dropdown = require('controls/Dropdown');
    var Button = require('controls/Button');
    var Toggle = require('controls/Toggle');
    var RadioButton = require('controls/RadioButton');

    var setting = require('configs/Setting');
    window.setting = setting;

    var transitions = [
        'Horizontal Slide',
        'Vertical Slide',
        'Diagonal Slide',
        'In and Out',
//        'Hexagonal',
//        'Calender',
        'Gallery',
        'Cube',
        'Gravity',
        'Extra! Extra!',
        'Fold',
        'Flip',
        'Scale',
        'Carousel',
        'Push'
    ];

    function TransitionDropdownView() {
        View.apply(this, arguments);

        this.buttons = [];
        this.isShown = false;
        this.rootModifier = new StateModifier();
        this.mainNode = this.add(this.rootModifier);

        _createDropdown.call(this);
        _setListeners.call(this);
    }

    TransitionDropdownView.prototype = Object.create(View.prototype);
    TransitionDropdownView.prototype.constructor = TransitionDropdownView;

    TransitionDropdownView.DEFAULT_OPTIONS = {
        align:[1,0],
        origin: [1,0]
    };

    TransitionDropdownView.prototype.hide = function() {
        if (this.isShown == true) {
            if(setting.get('sound') === 'on')this.clickSound.play();
            this.isShown = false;
            this.triangleModifier.setOpacity(0);
            this.dropdown.hide();
        }
    };

    function _createDropdown() {
        var opts = this.options;
        var dropdownView = new View();      // entire dropdown, button icon + dropdown menu
        var dropdownMenuView = new View();  // menu that gets displayed

        var transitionsMenu = new SequentialLayout();
        var menuArray = [];
        transitionsMenu.sequenceFrom(menuArray);

        // create header
        menuArray.push(new Surface ({
            content: 'Transitions',
            size: [window.innerWidth-20, 35],
            properties: {
                textAlign: 'left',
                lineHeight: '40px',
                paddingLeft: '20px',
                fontWeight: 'bold'
            }
        }));

        // create list of transitions
        for (var i = 0; i < transitions.length; i++) {
            var button = new Surface({
                size: [window.innerWidth-40, 37],
                content: transitions[i],
                properties: {
                    textAlign: 'left',
                    borderTop: '1px solid lightGray',
                    lineHeight: '35px',
                    paddingLeft: '20px',
                    margin: '0px 20px'
                }
            });
            this.buttons.push(button);
            menuArray.push(button);
        }

        var transitionIndex = transitions.indexOf(setting.get('transition'));
        if (transitionIndex==-1) transitionIndex=0;
        this.radioButtons = new RadioButton({
            radius: 10,     // dist of dots from left
            lineHeight: 37,
            content:transitions,
            state: transitionIndex,
            duration: 300,
            curve: Easing.outQuad
        });

        var radioModifier = new StateModifier({
            transform: Transform.translate(5,36,2)
        });

        dropdownMenuView.add(transitionsMenu);
        dropdownMenuView.add(radioModifier).add(this.radioButtons);

        this.dropdown = new Dropdown({
            size: [window.innerWidth, window.innerHeight - 50],
            renderable: dropdownMenuView,
            origin: opts.origin,
            align: opts.align,
            baseTransform: Transform.translate(0, 45, 2),
            renderableTransform: Transform.translate(0,0,2)
        });

        this.dropdownButton = new Surface({
            content:'<div class="fa fa-bars fa-2x"></div>',
            size: [50, 45],
            properties: {
                //border: '1px solid gray',
                textAlign: 'center',
                lineHeight: '50px'
            }
        });

        var buttonModifier = new StateModifier({
            origin: opts.origin,
            align: opts.align,
            transform: Transform.translate(0,0,2.5)
        });

        this.clickSound = new Howl({
            urls: ['assets/audio/bubble.mp3'],
            volume: 0.2
        });

        this.dropdownButton.on('click', function() {
            this._eventOutput.emit('open timerView');

            if (this.isShown == false){
                this.dropdown.toggle();
                this.triangleModifier.setOpacity(1, {duration: 120});
                this.isShown = true;
                this._eventOutput.emit('closeSettingDropdown');
            } else {
                this.dropdown.toggle();
                this.triangleModifier.setOpacity(0);
                this.isShown = false;
            }

            if(setting.get('sound') === 'on')this.clickSound.play();

        }.bind(this));

        var triangle = new Surface({
            content:'<div class="fa fa-caret-up fa-inverse fa-lg"></div>',
            size: [50, 15],
            properties: {
                //border: '1px solid gray',
                textAlign: 'center'
            }
        });

        this.triangleModifier = new StateModifier({
            align: opts.align,
            origin: opts.origin,
            transform: Transform.translate(0,31,2),
            opacity: 0
        });

        dropdownView.add(buttonModifier).add(this.dropdownButton);
        dropdownView.add(this.triangleModifier).add(triangle);
        dropdownView.add(this.dropdown);
        this.mainNode.add(dropdownView);
    }

    function _setListeners() {

        // when button clicked need to change radio button
        _.each(this.buttons, function(button, index){
            button.on('click', function() {
                setting.save({transition: transitions[index]});
                console.log(transitions[index]);
                this.radioButtons.changeState(index);
            }.bind(this));
        }.bind(this));

        this.dropdownButton.pipe(this._eventOutput);


    }

    module.exports = TransitionDropdownView;
});