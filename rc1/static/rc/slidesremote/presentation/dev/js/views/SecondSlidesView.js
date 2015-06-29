define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
//    var Scrollview = require('famous/views/Scrollview');
    var Scrollview = require('widgets/Scrollview');
    var Scroller = require('famous/views/Scroller');
    var Utility = require('famous/utilities/Utility');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    var Transitionable  = require('famous/transitions/Transitionable');
    var Easing          = require('famous/transitions/Easing');
    var GenericSlidesView = require('views/GenericSlidesView');
    var SecondSlidesViewItem = require('views/SecondSlidesViewItem');

    var StatesLightbox = require('widgets/StatesLightbox');

    var setting = require('configs/Setting');
    var Slides = require('collections/Slides');
    var Slides0 = require('collections/Slides0');
    var Slides1 = require('collections/Slides1');
    var Slide = require('models/Slide');

    function SecondSlidesView(options) {
        this.SlidesViewItem = SecondSlidesViewItem;
        var transitionName = (setting.get('transition') || 'horizontal slide').toLowerCase();
        this.pageTransition = pageTransitions[transitionName];
        GenericSlidesView.apply(this, arguments);
        this.setEvents.call(this);
        _createHintView.call(this);
    }
    SecondSlidesView.prototype = Object.create(GenericSlidesView.prototype);
    SecondSlidesView.prototype.constructor = SecondSlidesView;

    SecondSlidesView.DEFAULT_OPTIONS = {
        slidesNumber: 30,
        slideViewItemSize: [window.innerWidth, window.innerHeight]
    };

    SecondSlidesView.prototype.createScrollView = function(){
        this.scrollview = new Scrollview({
            direction: Utility.Direction.X,
            margin:window.innerWidth*2,
            paginated: true
        });
        Engine.pipe(this.scrollview);
        this.scrollviewScale = new Transitionable(1);
        this.scrollviewMod = new Modifier({
            transform:function(){
                return Transform.scale(this.scrollviewScale.get(),this.scrollviewScale.get(),1)
            }.bind(this)
        });
        this.scrollviewMod2 = new Modifier({
//            align: [0,0],
            origin: [.5,.5],
            size:[window.innerWidth,window.innerHeight]
        });
        this.scrollviewGalleryMod = new Modifier();
        this.add(this.scrollviewGalleryMod).add(this.scrollviewMod).add(this.scrollviewMod2).add(this.scrollview);
    };

    SecondSlidesView.prototype.setEvents = function(){

    };

    SecondSlidesView.prototype.setListeners = function(){
        GenericSlidesView.prototype.setListeners.call(this);
        this.collection.on('add', function(model , collection){
            //-------------------------- model add in order
            var slidesViewItem = new this.SlidesViewItem({model: model});
            this.slidesArray[model.get('index')] = slidesViewItem;
            if(this.scrollview)slidesViewItem._eventOutput.pipe(this.scrollview);
            if(this.sync)slidesViewItem._eventOutput.pipe(this.sync);
//            slidesViewItem._eventOutput.on('slidesDownloaded', function(){
//                this.downloadedNumber += 1;
//                console.log(this.downloadedNumber, this.slidesNumber);
//            }.bind(this))
        }.bind(this));

        setting.on('change:transition', function(model, value){
            console.log(value);
            this.hintView.setContent(value);
            this.hintMod.setOpacity(1, {
                duration: 400, curve: Easing.outElastic
            }, function() {
                this.hintMod.setOpacity(0, {
                    duration: 2000, curve: Easing.easein
                }, function(){
                    this.hintMod.setTransform(Transform.scale(1,1,1));
                }.bind(this));
            }.bind(this));
//            this.hintMod.setTransform(Transform.scale(1.3,1.3,1), {
//                    duration: 400, curve: Easing.outElastic
//                }
//            );
            this.changeTransition(value);
        }.bind(this));
        this.changeTransition(setting.get('transition'));
    };

    function _createHintView() {
        this.hintView = new Surface({
            size: [500,100],
            content: setting.get('transition'),
            properties: {
                fontFamily:'Lucida Console',
                color: 'grey',
                fontSize: '30px',
                lineHeight: '100px',
                textAlign: 'Right'
            }
        });
        this.hintPos = new StateModifier({
            origin: [1, 0],
            align: [0.92, 0],
            transform: Transform.translate(0,0,1)
        });
        this.hintMod = new StateModifier({
            opacity: 0
        });
        this.add(this.hintPos).add(this.hintMod).add(this.hintView);
    }

    SecondSlidesView.prototype.scrollToPage = function(pageIndex){
        var curSlideviewItem = this.scrollview._node.get();
        var nextSlideviewItem = this.slidesArray[pageIndex];
        if(this.getCurPage() == pageIndex){
            curSlideviewItem.item.doAnimate();
        }else{
            this.slidesArray.map(function(slideviewItem){
                if (this.pageTransition.showClass)
                    slideviewItem.addClass(this.pageTransition.showClass);
                else
                    slideviewItem.addClass('');
            }.bind(this));
            if (this.pageTransition.outClass && this.pageTransition.inClass) {
                var isBackward = pageIndex<this.getCurPage();
                GenericSlidesView.prototype.scrollToPage.call(this, pageIndex, true);
                this.scrollviewScale.set(0);
                $('#pt-main').show();
                setTimeout(function(){
                    curSlideviewItem.hide(this.pageTransition.outClass, isBackward);
                    nextSlideviewItem.show(this.pageTransition.inClass, isBackward);
                }.bind(this),0);
            } else {
                GenericSlidesView.prototype.scrollToPage.call(this, pageIndex, false);
                this.scrollviewScale.set(1);
                $('#pt-main').hide();
                if (this.pageTransition.scale!=1)
                    this.scrollviewScale.set(this.pageTransition.scale,{ duration: 300 }).set(1,{ duration: 700});
            }
            if (this.pageTransition.galleryMod == true){
                this.scrollviewGalleryMod.setTransform(Transform.rotateY(Math.PI/4), {duration: 300});
                this.scrollviewGalleryMod.setTransform(Transform.rotateY(0), {duration: 700, curve: Easing.inExpo});
            }
        }
    };

    SecondSlidesView.prototype.goToPage = function(pageIndex){
        GenericSlidesView.prototype.goToPage.call(this, pageIndex);
        if (this.pageTransition.outClass && this.pageTransition.inClass) {
            this.scrollviewScale.set(0);
            $('#pt-main').show();
            var curSlideviewItem = this.scrollview._node.get();
            var nextSlideviewItem = this.slidesArray[pageIndex];
            if (nextSlideviewItem) {
                curSlideviewItem.hide(this.pageTransition.outClass, pageIndex<this.getCurPage());
                nextSlideviewItem.show(this.pageTransition.inClass, pageIndex<this.getCurPage());
            }
        } else {
            this.scrollviewScale.set(1);
            $('#pt-main').hide();
        }
    };

    SecondSlidesView.prototype.changeTransition = function(transitionName){
        var transitionName = (transitionName||'').toLowerCase();
        this.pageTransition = pageTransitions[transitionName] || pageTransitions['horizontal slide'];
        if (this.pageTransition.scale) this.scrollviewScale.set(this.pageTransition.scale,{ duration: 300 }).set(1,{ duration: 700});
        if (this.pageTransition.outputFunction) this.scrollview.outputFrom(this.pageTransition.outputFunction);
        if (this.pageTransition.options) this.scrollview.setOptions(this.pageTransition.options);
        this.goToPage(this.getSelectedPage());
    };

    var pageTransitions = {
        'horizontal slide': { // Horizontal Slide
            galleryMod: false,
            scale:.8,
            showScale: 1,
            outputFunction: function(offset) {
                return Transform.translate(offset+10, 0);
            },
            options: {
                direction: Utility.Direction.X,
                margin:window.innerWidth*2
            }
        },
        'vertical slide': { // Vertical Slide
            galleryMod: false,
            scale:.8,
            outputFunction: function(offset) {
                return Transform.translate(0,offset);
            },
            options: {
                direction: Utility.Direction.Y,
                margin:window.innerWidth*2
            }
        },
        'diagonal slide': { // Diagonal Slide
            galleryMod: false,
            scale:.8,
            outputFunction: function(offset) {
                return Transform.translate(offset, offset, 0);
            },
            options: {
                direction: Utility.Direction.Y,
                margin:window.innerWidth*2
            }
        },
        'in and out': { // In and Out
            galleryMod: false,
            scale:.8,
            outputFunction: function(offset) {
                return Transform.translate(0, -offset*1.3, -offset);
            },
            options: {
                direction: Utility.Direction.Y,
                margin: window.innerWidth*2
            }
        },
        'hexagonal': {  // Hexagonal
            galleryMod: false,
            scale:.8,
            outputFunction: function(offset) {
                return Transform.moveThen([-window.innerWidth/2,window.innerHeight*1.5,0], Transform.rotateZ(-offset/window.innerHeight*Math.PI/3));
            },
            options: {
                direction: Utility.Direction.Y,
                margin: window.innerWidth*2
            }
        },
        'calender': {  // Calender
            galleryMod: false,
            scale: 1,
            outputFunction: function(offset) {
                return Transform.moveThen([0,0,0], Transform.rotateX(offset/window.innerHeight*Math.PI/2));
            },
            options: {
                direction: Utility.Direction.Y,
                margin: window.innerWidth*2
            }
        },
        'gallery': {  // Gallery
            galleryMod: true,
            scale:.8,
            outputFunction: function(offset) {
                return Transform.translate(offset,0);
            },
            options: {
                direction: Utility.Direction.X,
                margin:window.innerWidth*2
            },
            showClass : 'shadow'
        },
        'cube': {  // Cube
            galleryMod: false,
            scale:1,
            outputFunction: function(offset) {
                return Transform.moveThen([-window.innerWidth/2,0,window.innerWidth/2], Transform.rotateY(offset/window.innerWidth*Math.PI/2));
            },
            options: {
                direction: Utility.Direction.X,
                margin: window.innerWidth*2
            }
        },
        'gravity': {  // Gravity
            galleryMod: false,
            scale: 1,
            outputFunction: function(offset) {
                return Transform.identity;
            },
            options: {
                direction: Utility.Direction.Y,
                margin:window.innerWidth*2
            },
            outClass : 'pt-page-rotateFall pt-page-ontop',
            inClass : 'pt-page-scaleUp'
        },
        'extra! extra!': {  //Extra! Extra!
            galleryMod: false,
            scale: 1,
            outputFunction: function(offset) {
                return Transform.identity;
            },
            options: {
                direction: Utility.Direction.Y,
                margin:window.innerWidth*2
            },
            outClass : 'pt-page-rotateOutNewspaper',
            inClass : 'pt-page-rotateInNewspaper pt-page-delay500'
        },
        'fold': {  // Fold
            galleryMod: false,
            scale: 1,
            outputFunction: function(offset) {
                return Transform.identity;
            },
            options: {
                direction: Utility.Direction.Y,
                margin:window.innerWidth*2
            },
            outClass : 'pt-page-rotateFoldLeft',
            inClass : 'pt-page-moveFromRightFade'
        },
        'flip': {  // Flip
            galleryMod: false,
            scale: 1,
            outputFunction: function(offset) {
                return Transform.identity;
            },
            options: {
                direction: Utility.Direction.Y,
                margin:window.innerWidth*2
            },
            outClass : 'pt-page-flipOutRight',
            inClass : 'pt-page-flipInLeft pt-page-delay500'
        },
        'scale': {  // Scale
            galleryMod: false,
            scale: 1,
            outputFunction: function(offset) {
                return Transform.identity;
            },
            options: {
                direction: Utility.Direction.Y,
                margin:window.innerWidth*2
            },
            outClass : 'pt-page-scaleDownCenter',
            inClass : 'pt-page-scaleUpCenter pt-page-delay400'
        },
        'carousel': {  // Carousel
            galleryMod: false,
            scale: 1,
            outputFunction: function(offset) {
                return Transform.identity;
            },
            options: {
                direction: Utility.Direction.Y,
                margin:window.innerWidth*2
            },
            outClass : 'pt-page-rotateCarouselBottomOut pt-page-ontop',
            inClass : 'pt-page-rotateCarouselBottomIn'
        },
        'push': {  // Push
            galleryMod: false,
            scale: 1,
            outputFunction: function(offset) {
                return Transform.identity;
            },
            options: {
                direction: Utility.Direction.Y,
                margin:window.innerWidth*2
            },
            outClass : 'pt-page-rotatePushBottom',
            inClass : 'pt-page-rotatePullTop pt-page-delay180'
        }
    };

    module.exports = SecondSlidesView;
});


