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



    function MainScreen() {
        View.apply(this, arguments);
        _createCollections.call(this);
        _createViews.call(this);
        _setListeners.call(this);
        _debug.call(this);
    }
    function _debug(){
        window.main = this;
    }


    MainScreen.prototype = Object.create(View.prototype);
    MainScreen.prototype.constructor = MainScreen;

    MainScreen.DEFAULT_OPTIONS = {};

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
            },
            model: slideModel
        });
        surface.on('click', function(){
            slideModel.save('timeStamp', Date.now())
        }.bind(surface))
        this.surfaces.push(surface);
        surface.pipe(this.scrollview);
        slideModel.on('change:timeStamp',function(e,b,c){
            console.log('model', e.get('id'),b,c)
        })
    }

    function _createCollections(){
        this.slides = new Slides();
        var slidesArray = [
            { id: 1, content: 'this is page 1' },
            { id: 2, content: 'Henry McCoy' },
            { id: 3, content: 'Bobby Drake' },
            { id: 4, content: 'this is page 1' },
            { id: 5, content: 'Henry McCoy' },
            { id: 6, content: 'Bobby Drake' },
            { id: 7, content: 'this is page 1' },
            { id: 8, content: 'Henry McCoy' },
            { id: 9, content: 'Bobby Drake' },
            { id: 10, content: 'this is page 1' },
            { id: 11, content: 'Henry McCoy' },
            { id: 12, content: 'Bobby Drake' }
        ];
        _.each(slidesArray, function(slide){
            this.slides.create(slide);
        }.bind(this));
        Slide.on('uniquemodel.add', _.bind(this.slides.add, this.slides));
    }

    module.exports = MainScreen;
});


