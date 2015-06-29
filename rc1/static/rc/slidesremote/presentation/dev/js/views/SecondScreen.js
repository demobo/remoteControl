define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require('famous/views/Scrollview');
    var Utility = require('famous/utilities/Utility');
    var Transitionable  = require('famous/transitions/Transitionable');

    var Slides0 = require('collections/Slides0');
    var Slides1 = require('collections/Slides1');
    var Slide0 = require('models/Slide0');
    var Slide1 = require('models/Slide1');

    var Slide = require('models/Slide');

    var SlideShow = require('views/SlideShow');
    var SecondSlidesView = require('views/SecondSlidesView');
    var setting = require('configs/Setting');
    var LoadingbarView = require('views/LoadingbarView');



    function SecondScreen() {
        View.apply(this, arguments);
        _loadCollections.call(this);
        _loadViews.call(this);
        _setListeners.call(this);
        _debug.call(this);
    }

    function _debug(){
        this.setting = setting;
        window.secondView = this;
        window.Slides0 = Slides0;
        window.Slides1 = Slides1;
        window.Slide = Slide;
    }

    SecondScreen.prototype = Object.create(View.prototype);
    SecondScreen.prototype.constructor = SecondScreen;

    SecondScreen.DEFAULT_OPTIONS = {
    };

    function _loadCollections(){
        this.slidesCollection = [];
        this.slidesCollection[0] = new Slides0();
        this.slidesCollection[1] = new Slides1();
        Slide0.on('uniquemodel.add', _.bind(this.slidesCollection[0].add, this.slidesCollection[0]));
        Slide1.on('uniquemodel.add', _.bind(this.slidesCollection[1].add, this.slidesCollection[1]));
        if(setting.get('currentSlidesIndex')){
            this.currentSlidesIndex = setting.get('currentSlidesIndex');
        }else{
            //setting.save('currentSlidesIndex', 0);
            this.currentSlidesIndex = 0;
        }
    }

    function _loadViews(){
        this.currentSlidesIndex = 0;
        this.slidesViewArray = [];
        this.slidesViewArray[0] = new SecondSlidesView({collection:this.slidesCollection[0], slidesIndex: 0});
        this.slidesViewArray[1] = new SecondSlidesView({collection:this.slidesCollection[1], slidesIndex: 1});

        this.slidesViewMods =[];
        this.slidesTransitionable = new Transitionable(0);
        this.slidesViewMods[0] = new Modifier({
            opacity: function(){
                return 1.5 - this.slidesTransitionable.get();
            }.bind(this),
            transform: function(){
                var coefficient = 0;
                if(this.currentSlidesIndex){
                    coefficient = window.innerWidth*3
                }else{
                    coefficient = - window.innerWidth*3
                }
                return Transform.translate(-this.slidesTransitionable.get()*coefficient,0, 0)
            }.bind(this)
        });
        this.slidesViewMods[1] = new Modifier({
            opacity: function(){
                return this.slidesTransitionable.get()+0.5;
            }.bind(this),
            transform: function(){
                var coefficient = 0;
                if(this.currentSlidesIndex){
                    coefficient = window.innerWidth*3
                }else{
                    coefficient = - window.innerWidth*3
                }
                return Transform.translate((2 - this.slidesTransitionable.get())*coefficient,0, 0)
            }.bind(this)
        });
        this.add(this.slidesViewMods[0]).add(this.slidesViewArray[0]);
        this.add(this.slidesViewMods[1]).add(this.slidesViewArray[1]);

        //--------------------------------------- loadingbarview
        this.loadingbarViewMod = new Modifier({
//            opacity: function(){
//                var temp = this.slidesTransitionable.get();
//                return 1 - Math.abs(1 - temp);
//            }.bind(this)
//            transform: function(){
//                var coefficient = 0;
//                if(this.currentSlidesIndex){
//                    coefficient = window.innerWidth*3
//                }else{
//                    coefficient = - window.innerWidth*3
//                }
//                return Transform.translate((1-this.slidesTransitionable.get())*coefficient,0, 0)
//            }.bind(this)
        });
        this.loadingbarView = new LoadingbarView({slidesTransitionable: this.slidesTransitionable, isSecondScreen: true});
        this.add(this.loadingbarViewMod).add(this.loadingbarView);
//------------------------- splashscreen
        this.splashMod = new StateModifier({
            origin: [0.5,0],
            align: [0.5,0],
            opacity: 0
//            transform: Transform.translate(0, 0, -1);
        })
        this.splashSurface = new Surface({
            content: "<iframe src='./splashScreen.html' id='splashIframe'></iframe>",
            properties:{
                zIndex: -2,
                width: window.innerWidth,
                height: window.innerHeight*0.5
            }
        })
        this.add(this.splashMod).add(this.splashSurface);

        //-----------------------------------------------------
        //this.slides.fetch();
        //var slideShow = new SlideShow({collection:this.slides});
        //this.add(slideShow);
        //-----------------------------------------------------
//        this.secondSlidesView = new SecondSlidesView({collection: this.slidesCollection, slidesIndex: 0});
//        this.add(this.secondSlidesView);
    }

    function _setListeners() {
        setTimeout(function(){
            document.getElementById('splashIframe').onload = function(){
                this.splashMod.setOpacity(1);
            }.bind(this)
        }.bind(this), 0)

        setting.on('change:currentSlidesIndex', function(settingModel, value){
            if(this.splashMod) this.splashMod.setOpacity(0, {duration: 1000});
            this.currentSlidesIndex = value;
//            this.getCurSlidesView().slidesNumber = setting.get('slidesNumber');
//            this.getCurSlidesView().downloadedNumber = 0;
            //----------------index 1 is loadingbarview
            this.slidesTransitionable.set(1, {duration: 2000, curve:'easeInOut'}, function(){
                this.slidesViewArray[value].goToPage(0);
            }.bind(this));
        }.bind(this));

        this.loadingbarView._eventOutput.on('allDownloaded', function(){
            this.slidesTransitionable.set(2 * this.currentSlidesIndex, {duration: 2000, curve:'easeInOut'});
        }.bind(this));
    }

    SecondScreen.prototype.getCurSlidesView = function(){
        return this.slidesViewArray[this.currentSlidesIndex];
    };

    SecondScreen.prototype.getNextSlidesView = function(){
        return this.slidesViewArray[1-this.currentSlidesIndex];
    };

    module.exports = SecondScreen;

});


