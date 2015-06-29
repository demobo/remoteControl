define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require('famous/views/Scrollview');
    var Utility = require('famous/utilities/Utility');
    var setting = require('configs/Setting');
    window.setting = setting;

    function SecondScreen() {
        View.apply(this, arguments);
        this.currSlide = 1;
        _loadCollections.call(this);
        _createViews.call(this);
        _setListeners.call(this);
        _debug.call(this);
    }
    function _debug(){
        window.TwoFacesCube = this;
    }


    SecondScreen.prototype = Object.create(View.prototype);
    SecondScreen.prototype.constructor = SecondScreen;

    SecondScreen.DEFAULT_OPTIONS = {
        transition:{duration: 500}
    };

    function _createViews() {
        var slides = _createSlide.call(this);
        this.slide0 = slides[0];
        this.slideMod0 = slides[1];
        slides = _createSlide.call(this);
        this.slide1 = slides[0];
        this.slideMod1 = slides[1];
        this.slideMod1.setTransform(Transform.rotateY(0));
    }

    function _createSlide(){
        var slide = new Surface({
            size:[undefined,undefined],
            content:'hkuhkjhjkhkjhk',
            properties:{
                color: 'blue',
                WebkitBackfaceVisibility: 'visible',
                background: 'hsl('+Math.random()*360+',100%,85%)'
            }
        });
        var slideModShift1 = new StateModifier({
            transform: Transform.translate(0,0,-window.innerWidth/2)
        });
        var slideModRotate = new StateModifier({
            origin:[0.5,0.5],
            transform: Transform.rotateY(Math.PI/2)
        });
        var slideModShift2 = new StateModifier({
            transform: Transform.translate(0,0,window.innerWidth/2)
        });
        this.add(slideModShift1).add(slideModRotate).add(slideModShift2).add(slide);
        return [slide, slideModRotate];
    }

    function _loadCollections(){
    }


    function _setListeners() {
        this.fakeEvent();
    }

    SecondScreen.prototype.fakeEvent = function(){
        var fakeRotate = _.debounce(function(){
            this.currSlide += 1;
            this['slide'+this.currSlide%2].setContent(this.currSlide);
            this.rotate();
        }.bind(this),600);
        Engine.on('keypress',function(){
            fakeRotate();
        }.bind(this));
    };

    SecondScreen.prototype.rotate = function(){
        this.rotateIn(this['slideMod'+this.currSlide%2])
        this.rotateOut(this['slideMod'+(this.currSlide+1)%2])
    };

    function _createSlideSurfaces(slideModel, i){
        console.log(slideModel)
        var surface = new Surface({
            size: [100, 300],
            content: slideModel.get('content'),
            properties: {
                textAlign: 'center',
                lineHeight: '300px',
                color: 'white',
                backgroundColor: "hsl(" + (i * 360 / 20) + ", 100%, 50%)"
            }
        });
    }
    SecondScreen.prototype.rotateOut = function(Mod){
        Mod.setTransform(Transform.rotateY(-Math.PI/2),this.options.transition,function(){
            Mod.setTransform(Transform.rotateY(Math.PI/2));
        }.bind(this));
    };

    SecondScreen.prototype.rotateIn = function(Mod){
        Mod.setTransform(Transform.rotateY(0),this.options.transition);
    };

    module.exports = SecondScreen;

});


