define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require('famous/views/Scrollview');
    var ViewSequence = require('famous/core/ViewSequence');
    var Utility = require('famous/utilities/Utility');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    var Transitionable  = require('famous/transitions/Transitionable');
    var Easing          = require('famous/transitions/Easing');

    var SlidesViewItem = require('views/SlidesViewItem');
    var Slide = require('models/Slide');

    function SlidesView(options) {
        View.apply(this, arguments);
        this.collection = options.collection;
        this.options.slideViewItemSize[0] *= 2;
        this.options.slideViewItemSize[1] *= 2;
        //---------------------- create reusable items
        _createReusableSlidesItem.call(this);
        //_createSlidesScrollview.call(this);
        //---------------------- add listeners to all reusable items
        //_setListeners.call(this);
        //----------------------  add touch event
        //_setEvents.call(this);
    }
//    function _debug(){
//        window.slideView = this;
//        window.collection = this.collection;
//        window.slidesArray = this.slidesArray;
//        window.slidesSequence = this.slidesSequence;
//        window.reuseableArray = this.reusableSlides;
//
//    }


    SlidesView.prototype = Object.create(View.prototype);
    SlidesView.prototype.constructor = SlidesView;

    SlidesView.DEFAULT_OPTIONS = {
        slidesNumber: 30,
        slideViewItemSize: [window.innerWidth/2, window.innerHeight/2],
        posThreshold: window.innerHeight/2,
        velThreshold: 0.5,
        transition: {
            duration: 300,
            curve: Easing.easeOut
        }};

    function _createReusableSlidesItem(){
        this.reusableSlides = [];
        this.reusableModels = [];
        _.each(_.range(this.options.slidesNumber), function(i){
            var slideModel = new Slide({id: 'slide'+i});
            this.reusableModels.push(slideModel);
            this.reusableSlides.push(new SlidesViewItem({model: slideModel}))
        }.bind(this))
    }



    SlidesView.prototype.setEvents = function(){
        this.sync = new GenericSync(
            ['touch'],
            {direction : GenericSync.DIRECTION_Y}
        );

        this.sync.on('start', function(data){
            this.initY = data.position;
        }.bind(this));

        this.sync.on('update', function(data) {
            if (this.slideViewItemScaleup != true){
                this.scrollviewScale.set(Math.min(1,Math.max(0.25,0.5 + (-data.position+this.initY)/(window.innerHeight/2))));
            } else {
                this.scrollviewScale.set(Math.min(1,Math.max(0.25,1 - (data.position-this.initY)/(window.innerHeight/2))));
                console.log( this.scrollviewScale.get())
            }
        }.bind(this));

        this.sync.on('end', (function(data) {
            var velocity = data.velocity;
            if (data.position == null){

            } else if(data.clientY > this.options.posThreshold) {
                if(velocity < -this.options.velThreshold) {
                    this.slideUp();
                } else {
                    this.slideDown();
                }
            } else {
                if(velocity >= this.options.velThreshold) {
                    this.slideDown();
                } else {
                    this.slideUp();
                }
            }
        }).bind(this));
    };

    SlidesView.prototype.setListeners = function() {
        _.each(this.reusableSlides, function(slidesViewItem){
            slidesViewItem._eventOutput.pipe(this.scrollview);
            slidesViewItem._eventOutput.pipe(this.sync);
        }.bind(this));
        this.collection.on('all', function(event, model, collection){
            console.log(event, model, collection);
            switch(event){
                case "remove":
                    this.slidesSequence.splice(this.collection.length, 1);
                    break;
                case "add":
                    var index = collection.indexOf(model);
                    console.log(index, "/?????", this.reusableSlides[index]);
                    //this.reusableModels[index].set(model.attributes);
                    this.slidesSequence.push(this.reusableSlides[index]);

                    break;

            }
        }.bind(this));
        this.collection.fetch();


    };

    SlidesView.prototype.slideUp = function(){
        this.slideViewItemScaleup = true;
        this.scrollviewScale.set(1,this.options.transition);
        this.scrollview.setOptions({
            paginated: true
        })
    };

    SlidesView.prototype.slideDown = function(){
        this.slideViewItemScaleup = false;
        this.scrollviewScale.set(0.5,this.options.transition);
        this.scrollview.setOptions({
            paginated: false
        })
    };
    SlidesView.prototype.addSlides = function(slidesData){
        while(slidesData.length > this.reusableSlides.length){
            var index = this.reusableSlides.length;
            var slideModel = new Slide({id: 'slide' + index});
            var slidesViewItem = new SlidesViewItem({model: slideModel});
            slidesViewItem._eventOutput.pipe(this.scrollview);
            slidesViewItem._eventOutput.pipe(this.sync);
            this.reusableSlides.push(slidesViewItem);
        }
        _.each(slidesData, function(slideData, index){
            this.reusableModels[index].set(slideData);
            this.collection.create(this.reusableModels[index]);
        }.bind(this))
    };

    SlidesView.prototype.reset = function(){
        _(this.collection.toArray()).invoke('destroy');
    };

    SlidesView.prototype.scrollToPage = function(){
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
    };

    module.exports = SlidesView;
});


