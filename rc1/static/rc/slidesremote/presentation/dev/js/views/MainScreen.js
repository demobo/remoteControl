define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var RenderController = require('famous/views/RenderController');
    var Utility = require('famous/utilities/Utility');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    var Transitionable  = require('famous/transitions/Transitionable');
    var Easing          = require('famous/transitions/Easing');
    var HeaderFooterLayout      = require('famous/views/HeaderFooterLayout');
    var EdgeSwapper = require('famous/views/EdgeSwapper');
    var Lightbox = require('famous/views/Lightbox');


    var FileScrollview = require('views/FileScrollview');
    var TimerView = require('views/TimerView');
    var MainSlidesView = require('views/MainSlidesView');
    var Files = require('collections/Files');
    var File = require('models/File');
    var Slides0 = require('collections/Slides0');
    var Slides1 = require('collections/Slides1');
    var Slide = require('models/Slide');
    var Slide0 = require('models/Slide0');
    var Slide1 = require('models/Slide1');
    var Helper = require('configs/Helper');
    var LoadingbarView = require('views/LoadingbarView');

    var setting = require('configs/Setting');

    function MainScreen() {
        View.apply(this, arguments);
        _createCollections.call(this);
        _createViews.call(this);
        _setEvents.call(this);
        _setListeners.call(this);
        _debug.call(this);
        this.slideUp();
        // this.slideDown({duration:0});
    }
    function _debug(){
        this.setting = setting;
        window.main = this;
        window.Slides0 = Slides0;
        window.Slides1 = Slides1;
        window.Slide0 = Slide0;
    }


    MainScreen.prototype = Object.create(View.prototype);
    MainScreen.prototype.constructor = MainScreen;

    MainScreen.DEFAULT_OPTIONS = {
        smallHeight: 70,
        posThreshold: window.innerHeight/2,
        velThreshold: 0.75,
        transition: {
            duration: 300,
            curve: Easing.outBounce
        }
    };

    function _createCollections(){
        // this is a asynchronous
        this.filesCollection = new Files();
//        this.filesCollection.fetch();

        this.slidesCollection = [];
        this.slidesCollection[0] = new Slides0();
        this.slidesCollection[1] = new Slides1();

        Slide0.on('uniquemodel.add', _.bind(this.slidesCollection[0].add, this.slidesCollection[0]));
        Slide1.on('uniquemodel.add', _.bind(this.slidesCollection[1].add, this.slidesCollection[1]));



        // TODO user select a file to open and then build slides collection

        //Todo: Important
// ------------------------------------------------------------------------
        //create an fade files collection
//        if (this.filesCollection.length == 0) this.createFadeMenus();

//        this.slidesCollection = new Slides();
//        if (this.slidesCollection.length == 0) this.createFadeSlides();
// ------------------------------------------------------------------------

    }



    function _createViews() {
        //------------------------------------ filesView
        this.presentNodePos = new Transitionable(0);
        var fileViewModifier = new Modifier({
            // toggle between 0 and 1
            opacity: function() {
                return this.presentNodePos.get()/window.innerHeight;
            }.bind(this)
        });

        this.layout = new HeaderFooterLayout({
            direction: Utility.Direction.Y,
            headerSize: 60,
            footerSize: 80
        });
        this.add(fileViewModifier).add(this.layout);
        this.FileScrollview = new FileScrollview({collection:this.filesCollection});
        this.layout.content.add(this.FileScrollview);
        //------------------------------------ slidesView

        setting.save('currentSlidesIndex', 0);
        this.currentSlidesIndex = 0;
        this.slidesViewArray = [];
        this.slidesViewArray[0] = new MainSlidesView({collection:this.slidesCollection[0], slidesIndex: 0});
        this.slidesViewArray[1] = new MainSlidesView({collection:this.slidesCollection[1], slidesIndex: 1});

        //------------------------------------ appTitle view
        this.appTitle = new Surface({
            classes: ['appTitle'],
            content:'<span class="app-title-pic"></span>' + '<div class="app-title"><div>SELECT A FILE</div></div>',
            properties: {
                zIndex: 9
            }
        });
        this.layout.header.add(this.appTitle);

        this.presentNode = new RenderNode();

        this.presentNodeMod = new Modifier({
            transform: function() {
                return Transform.translate(0,this.presentNodePos.get(), 1);
            }.bind(this)
        });
        this.add(this.presentNodeMod).add(this.presentNode);

        //------------------------------------ timerView
        var timerViewModifier = new Modifier({
            // toggle between 0 and 1
            opacity: function() {
                //var slidesView = this.getCurSlidesView();
                if (this.getCurSlidesView())
                    return 2*(1 - this.getCurSlidesView().scrollviewScale.get());
                else
                    return 1;
            }.bind(this)
        });
        this.timerView = new TimerView();
        this.presentNode.add(timerViewModifier).add(this.timerView);
//        var slidesView = this.getCurSlidesView();
        //---------------- modified to fix one slideview can sync with timerview

        // timer is added to the node of MainScreen instead of TimerView.
        this.timerMod = new Modifier({
            transform:function(){
                return Transform.translate(0,this.presentNodePos.get(),2)
            }.bind(this)
        });
        this.timerMod2 = new Modifier({
            transform: function(){
                return Transform.scale(1.7-1.4 * this.getCurSlidesView().scrollviewScale.get(), 1.7-1.4 *  this.getCurSlidesView().scrollviewScale.get() ,1);
            }.bind(this),
            origin:function(){
                return [0.5, (1 - this.getCurSlidesView().scrollviewScale.get())/3];
            }.bind(this)
        });
        this.add(this.timerMod2).add(this.timerMod).add(this.timerView.timer);

        //-------------------------------slides view
        this.slidesViewMods =[];
        this.slidesTransitionable = new Transitionable(1);
        this.slidesViewMods[0] = new Modifier({
            opacity: function(){
//                return 1 - this.slidesTransitionable.get();
                var temp = 1 - this.slidesTransitionable.get();
                if(temp >= 0) return temp;
                return 0;
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
                var temp = this.slidesTransitionable.get();
                if(temp <= 1) return 0;
                return temp - 1;
            }.bind(this),
            transform: function(){
                var coefficient = 0;
                if(this.currentSlidesIndex){
                    coefficient = window.innerWidth*3
                }else{
                    coefficient = - window.innerWidth*3
                }
                return Transform.translate((2-this.slidesTransitionable.get())*coefficient,0, 0)
            }.bind(this)
        });
        this.presentNode.add(this.slidesViewMods[0]).add(this.slidesViewArray[0]);
        this.presentNode.add(this.slidesViewMods[1]).add(this.slidesViewArray[1]);

        //--------------------------------------- loadingbarview
        this.loadingbarViewMod = new Modifier({
//            opacity: function(){
//                var temp = this.slidesTransitionable.get();
//                return 1 - Math.abs(1 - temp);
//            }.bind(this),
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
        this.loadingbarView = new LoadingbarView({slidesTransitionable: this.slidesTransitionable});
        this.presentNode.add(this.loadingbarViewMod).add(this.loadingbarView);

    }

    function _setListeners() {
        // TODO refactor with view event
        this.filesCollection.on('change:timeStamp', function(file){
            this.slideUp(file);
            _setSlides.call(this, file);
        }.bind(this));

        // timerView slide up when clicked
        this._eventOutput.on('open timerView', function(){
            if(main.presentNodePos.get() == window.innerHeight-70) this.slideUp();
        });

        this.loadingbarView._eventOutput.on('allDownloaded', function(){
            this.slidesTransitionable.set(2 * this.currentSlidesIndex, {duration: 2000, curve:'easeInOut'});
        }.bind(this));

        document.addEventListener("volumedownbutton", onVolumeDownKeyDown.bind(this), false);
        document.addEventListener("volumeupbutton", onVolumeUpKeyDown.bind(this), false);
    }

    function _setSlides(file){
        this.currentSlidesIndex = 1 - this.currentSlidesIndex;
//        setting.save('currentSlidesIndex', this.currentSlidesIndex);
        Helper.readEmbedLink(file.get('embedLink'), file.get('title'), function(slidesData){
//            setting.save('slidesNumber', slidesData.length)
            setting.save('currentSlidesIndex', this.currentSlidesIndex);
            setting.save('downloadedRatio',slidesData[0].fileTitle +'/' + 0 + '/' + slidesData.length);
            // slidesData can ensure the sequence
            this.getCurSlidesView().reset();
            this.getCurSlidesView().addSlides(slidesData);
            //----------------index 1 is loadingbarview
            this.slidesTransitionable.set(1, {duration: 2000, curve:'easeInOut'},
                function(){
                    this.getNextSlidesView().reset();
                }.bind(this));

        }.bind(this));
    }

    function onVolumeDownKeyDown() {
        this.getCurSlidesView().nextPage.call(this.getCurSlidesView());
    }

    function onVolumeUpKeyDown() {
        this.getCurSlidesView().previousPage.call(this.getCurSlidesView());
    }

    function _setEvents(){
        this.timerView.pipe(this._eventOutput);
        var sync = new GenericSync(
            ['touch'],
            {direction : GenericSync.DIRECTION_Y}
        );
        // this.timerView.pipe(sync);
        // this.loadingbarView.pipe(sync);


        sync.on('update', function(data) {
            var currentPosition = this.presentNodePos.get();
            this.presentNodePos.set(Math.max(0, Math.min(window.innerHeight,currentPosition + data.delta)));
        }.bind(this));

        sync.on('end', (function(data) {
            var velocity = data.velocity;

            if(this.presentNodePos.get() > this.options.posThreshold) {
                if(velocity < -this.options.velThreshold) {
                    this.slideUp();
                } else {
                    this.slideDown();
                }
            } else {
                if(velocity > this.options.velThreshold) {
                    this.slideDown();
                } else {
                    this.slideUp();
                }
            }
        }).bind(this));
    }


    MainScreen.prototype.slideUp = function(){
        this.presentNodePos.set(0, this.options.transition);
    };

    MainScreen.prototype.slideDown = function(transition){
        this.presentNodePos.set(window.innerHeight-this.options.smallHeight, transition || this.options.transition)
    };

    MainScreen.prototype.createFadeMenus = function(){
        for(var i = 0; i<20; i++){
            this.filesCollection.add({name:i})
        }
    };

    MainScreen.prototype.createFadeSlides = function(){
        var abc = 'ABCEDFG';
        for(var i = 0; i<abc.length; i++){
            this.slidesCollection.add({content:abc[i]})
        }
    };

    MainScreen.prototype.reset = function(){
        this.FileScrollview.reset();
        // -------------------------modified
        this.slidesViewArray[0].reset();
        this.slidesViewArray[1].reset();
    };

    MainScreen.prototype.getCurSlidesView = function(){
        return this.slidesViewArray[this.currentSlidesIndex];
    };

    MainScreen.prototype.getNextSlidesView = function(){
        return this.slidesViewArray[1-this.currentSlidesIndex];
    };

	MainScreen.prototype.setSlides = function(slidesData){
        this.currentSlidesIndex = 1 - this.currentSlidesIndex;
        setting.save('currentSlidesIndex', this.currentSlidesIndex);
        setting.save('downloadedRatio',slidesData[0].fileTitle +'/' + 0 + '/' + slidesData.length);
        // slidesData can ensure the sequence
        this.getCurSlidesView().reset();
        this.getCurSlidesView().addSlides(slidesData);
        this.slidesTransitionable.set(1, {duration: 2000, curve:'easeInOut'},
            function(){
                this.getNextSlidesView().reset();
            }.bind(this));
    };
    module.exports = MainScreen;
});


