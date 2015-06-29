define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ViewSequence = require('famous/core/ViewSequence');
    var Slide = require('models/Slide');
    var Slide0 = require('models/Slide0');
    var Slide1 = require('models/Slide1');
    var Helper = require('configs/Helper');


    function GenericSlidesView(options) {
        View.apply(this, arguments);
        this.collection = options.collection;
        this.slidesIndex = options.slidesIndex;
        this.setEvents.call(this);
        this.createViews.call(this);
        this.setListeners.call(this);
        _debug.call(this);
    }
    function _debug(){
        window.slideView = this;
    }

    GenericSlidesView.prototype = Object.create(View.prototype);
    GenericSlidesView.prototype.constructor = GenericSlidesView;

    GenericSlidesView.prototype.createViews = function() {
        this.createScrollView.call(this);
        this.slidesArray = [];
        this.slidesSequence = new ViewSequence({array: this.slidesArray, index:0, loop:false}); // Not suggesting using loop = true
        this.scrollview.sequenceFrom(this.slidesSequence);
    };

    GenericSlidesView.prototype.createScrollView = function(){

    };

    GenericSlidesView.prototype.setListeners = function(){
        this.collection.on('change:timeStamp', function(model){
            var pageIndex = this.collection.indexOf(model);
            this.scrollToPage(pageIndex);
        }.bind(this));
        this.collection.on('all', function(event, model, collection, value){
//            console.log(event, model, collection, value);
            var index = this.collection.indexOf(model);
            switch(event){
                case "remove":
                    this.slidesSequence.splice(index, 1);
                    break;
            }
        }.bind(this));
        //------------------------
        this.collection.fetch();
        _.each(this.reusableSlides, function(slidesViewItem){
            slidesViewItem._eventOutput.pipe(this.scrollview);
        }.bind(this));
    };

    GenericSlidesView.prototype.addSlides = function(slidesData){
        //-------------------------- slides number
        this.slidesNumber = slidesData.length;
        this.downloadedNumber = 0;
        _.each(slidesData, function(data, index){
            // ---------------- this.slidesIndex+"-"+index give downloaded file names
            // here we can ensure order
            data.index = index;
            this.collection.create(data);
        }.bind(this));
        setTimeout(function(){
            this.selectByIndex(0);
        }.bind(this), 1000)
    };


    GenericSlidesView.prototype.reset = function(){
        var node = this.slidesSequence;
        while (this.slidesSequence.getPrevious()) {
            node = this.slidesSequence.getPrevious();
        }
        if (node) this.scrollview.sequenceFrom(node);
        // ------------------- remove all models in collection from localStorage
        this.collection.forEach(function(slideModel){
            slideModel.save('notes', undefined);
            slideModel.save('localURL', undefined);
            slideModel.save('remoteURL', undefined);
        });

        _(this.collection.toArray()).invoke('destroy');

    };

    GenericSlidesView.prototype.scrollToPage = function(pageIndex, skipAnimate){
        var curIndex = this.getCurPage();
        var diff =  pageIndex - curIndex;
        if(diff > 0){
            while(diff !== 0){
                this.scrollview.goToNextPage(skipAnimate);
                diff--;
            }
        }else if(diff < 0){
            while(diff !== 0){
                this.scrollview.goToPreviousPage(skipAnimate);
                diff++;
            }
        }
    };

    GenericSlidesView.prototype.goToPage = function(pageIndex){
        GenericSlidesView.prototype.scrollToPage.call(this, pageIndex, true);
    };

    GenericSlidesView.prototype.setEvents = function(){

    };

    GenericSlidesView.prototype.getSelectedPage = function(){
        var curSlideModel = this.collection.max(function(model) { return model.get('timeStamp'); });
        var index = this.collection.indexOf(curSlideModel);
        if (index==-1) index = 0;
        return index;
    };

    GenericSlidesView.prototype.getCurPage = function(){
        return this.scrollview._node.getIndex();
    };

    GenericSlidesView.prototype.selectByIndex = function(index){
        var slide = this.collection.at(index);
        if (slide) {
            slide.save('timeStamp', Date.now());
        }
    };

    module.exports = GenericSlidesView;
});


