define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var RenderNode = require('famous/core/RenderNode');
    var Lightbox = require('famous/views/Lightbox');

    function SlideShow(options) {

        this.collection = options.collection;
        this.numberOfSlides = this.collection.models.length;
        View.apply(this, arguments);
        _prepareSlides.call(this);
        _setlightbox.call(this);
        _setEvents.call(this);
        _debug.call(this);
    }

    function _debug(){
        window.slideshow = this;
        window.Transform = Transform;
    }

    SlideShow.prototype = Object.create(View.prototype);
    SlideShow.prototype.constructor = SlideShow;

    SlideShow.DEFAULT_OPTIONS = {
    };

    function _prepareSlides(){
        this.currIndex = 0;
        this.slidesArray = [];
        for (var i = 0; i < this.numberOfSlides; i++){
            this.slidesArray.push(this.addSlide(this.collection.models[i]));
        }
    }

    function _setlightbox(){
        this.lightbox = new Lightbox();
        this.getEffects('wipe');
        this.add(this.lightbox);
        this.showSlide(this.currIndex);
    }

    function _setEvents(){
        this.fakeEvent();
    }

    SlideShow.prototype.fakeEvent = function(){
        Engine.on('keydown',function(e){
            switch (e.keyCode){
                case 37:
                    this.previousSlide();
                    break;
                case 39:
                    this.nextSlide();
                    break;
                case 38:
                    var items = ['fade','wipe','upDown'];
                    var item = items[Math.floor(Math.random()*items.length)];
                    console.log('change effect', item);
                    this.changeEffect(item);
                    break;
                case 32:
                    var slideIndex = Math.floor(Math.random()*this.numberOfSlides);
                    this.showSlide(slideIndex);
                    break;

            }
        }.bind(this));
    };

    SlideShow.prototype.previousSlide = function(){
        this.currIndex = Math.max(0, this.currIndex-1);
        this.lightbox.show(this.slidesArray[this.currIndex]);
    };

    SlideShow.prototype.nextSlide = function(){
        this.currIndex = Math.min(this.numberOfSlides, this.currIndex+1);
        this.lightbox.show(this.slidesArray[this.currIndex]);
    };

    SlideShow.prototype.showSlide = function(index){
        this.currIndex = index;
        this.lightbox.show(this.slidesArray[this.currIndex]);
    };

    SlideShow.prototype.changeEffect = function(effectName){
//        this.lightbox.setOptions(this.getEffects(effectName));
        this.getEffects(effectName);
    };


    SlideShow.prototype.addSlide = function(model){
        return new Surface({
            size:[undefined,undefined],
            content: model.get('content'),
            properties:{
                color: 'black',
                background:'yellow'
            }
        });
    };

    SlideShow.prototype.getEffects = function(effectName) {
        switch (effectName) {
            case 'fade':
                this.lightbox.setOptions({
                    inTransform: Transform.identity,
                    outTransform: Transform.identity
                });
                break;
            case 'wipe':
                this.lightbox.setOptions({
                    inTransform: Transform.translate(window.innerWidth,0,0),
                    outTransform: Transform.translate(-window.innerWidth,0,0),
                    overlap:true
                });
                break;
            case 'upDown':
                this.lightbox.setOptions({
                    inTransform: Transform.translate(0,window.innerHeight,0),
                    outTransform: Transform.translate(0,-window.innerHeight,0),
                    overlap:true
                });
                break;
            default :
                this.lightbox.setOptions({
                    inTransform: Transform.identity,
                    outTransform: Transform.identity
                });
        }
    };

    module.exports = SlideShow;

});