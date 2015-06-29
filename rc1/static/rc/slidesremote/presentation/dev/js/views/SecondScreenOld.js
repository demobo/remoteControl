define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require('famous/views/Scrollview');
    var Utility = require('famous/utilities/Utility');

    var Slides = require('collections/Slides');
    var Slide = require('models/Slide');



    function SecondScreen() {
        View.apply(this, arguments);
        _createCollections.call(this);
        _createViews.call(this);
        _setListeners.call(this);
        _debug.call(this);
    }
    function _debug(){
        window.main = this;
    }


    SecondScreen.prototype = Object.create(View.prototype);
    SecondScreen.prototype.constructor = SecondScreen;

    SecondScreen.DEFAULT_OPTIONS = {};

    function _createViews() {
        this.surfaces = [];
        this.scrollview = new Scrollview({
            direction: Utility.Direction.X
        });
        this.scrollview.sequenceFrom(this.surfaces);
        this.slides.each(_createSlideSurfaces.bind(this));
        this.add(this.scrollview);

    }

    function _setListeners() {
        this.slides.on('change:timeStamp',function(e,b,c){
            console.log('collection', e.get('id'),b,c)
        })
        this.slides.on('change:timeStamp',moveTo.bind(this));
    }

    function moveTo(e){
        var curIndex = this.scrollview._node.getIndex();
        var diff = e.get('id') - 1 - curIndex;
        if(diff > 0){
            while(diff !== 0){
                this.scrollview.goToNextPage();
                diff--;
            }
        }else if(diff < 0){
            while(diff !== 0){
                this.scrollview.goToPreviousPage();
                diff++;
            }
        }
    }


    function _createSlideSurfaces(slideModel, i){
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

        this.surfaces.push(surface);
        surface.pipe(this.scrollview);
        slideModel.on('change:timeStamp',function(e,b,c){
            console.log('model', e.get('id'),b,c)
        })
    }

    function _createCollections(){
        this.slides = new Slides();
        this.slides.fetch();
        Slide.on('uniquemodel.add', _.bind(this.slides.add, this.slides));
    }

    module.exports = SecondScreen;
});


