define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
//    var Scrollview = require('famous/views/Scrollview');
    var Scrollview = require('widgets/Scrollview');
    var Utility = require('famous/utilities/Utility');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    var Transitionable  = require('famous/transitions/Transitionable');
    var Easing          = require('famous/transitions/Easing');
    var GenericSlidesView = require('views/GenericSlidesView');
    var MainSlidesViewItem = require('views/MainSlidesViewItem');
    var Helper = require('configs/Helper');


    function MainSlidesView(options) {
        this.SlidesViewItem = MainSlidesViewItem;
        GenericSlidesView.apply(this, arguments);
        this.setEvents.call(this);
    }
    MainSlidesView.prototype = Object.create(GenericSlidesView.prototype);
    MainSlidesView.prototype.constructor = MainSlidesView;

    MainSlidesView.DEFAULT_OPTIONS = {
        slidesNumber: 30,
        slideViewItemSize: [window.innerWidth, window.innerHeight],
        posThreshold: window.innerHeight*0.5,
        velThreshold: 1.5,
        transition: {
            duration: 300,
            curve: Easing.easeOut
        }};

    MainSlidesView.prototype.createScrollView = function(){
        this.scrollview = new Scrollview({
            direction: Utility.Direction.X,
            speedLimit: 70,
            friction: 0.00002,
            margin:window.innerWidth*2
        });
        this.scrollviewScale = new Transitionable(0.5);
        this.scrollviewMod = new Modifier({
            transform:function(){
                return Transform.scale(this.scrollviewScale.get(),this.scrollviewScale.get(),1)
            }.bind(this)
        });
        this.scrollviewMod2 = new Modifier({
            origin: function(){
                return [-0.5 * this.scrollviewScale.get() + 0.5,1]
            }.bind(this),
            transform: Transform.translate(0, -this.options.slideViewItemSize[1],1)
        });
        this.add(this.scrollviewMod).add(this.scrollviewMod2).add(this.scrollview);
    };

    MainSlidesView.prototype.setEvents = function(){
        this.sync = new GenericSync(
            ['touch']
//            {direction : GenericSync.DIRECTION_Y}
        );

        this.sync.on('start', function(){
            this.checkedY = false;
            this.disableY = false;
        }.bind(this));

        this.sync.on('update', function(data) {
            if ((!this.checkedY) && (Math.abs(data.position[0]/data.position[1]) > 1)){
                this.disableY = true
            }
            this.checkedY = true;
            if (!this.disableY){
                if (this.slideViewItemScaleup != true){
                    this.scrollviewScale.set(Math.min(1,Math.max(0.25,0.5 + (-data.position[1])/(window.innerHeight/2))));
                } else {
                    this.scrollviewScale.set(Math.min(1,Math.max(0.25,1 - (data.position[1])/(window.innerHeight/2))));
                }
            }
        }.bind(this));

        this.sync.on('end', (function(data) {
            var velocity = data.velocity[1];
            if (this.slideViewItemScaleup){
                if (this.scrollviewScale.get() <= 0.5)
                    this.slideDown();
                else if (velocity > this.options.velThreshold)
                    this.slideDown();
                else
                    this.slideUp();
            } else {
                if (this.scrollviewScale.get() >= 0.8)
                    this.slideUp();
                else if (velocity < -this.options.velThreshold)
                    this.slideUp();
                else
                    this.slideDown();
            }
//            if (data.position == null){
//
//            } else if(data.clientY > this.options.posThreshold) {
//                if(velocity < -this.options.velThreshold) {
//                    this.slideUp();
//                } else {
//                    this.slideDown();
//                }
//            } else {
//                if(velocity >= this.options.velThreshold) {
//                    this.slideDown();
//                } else {
//                    this.slideUp();
//                }
//            }
        }).bind(this));
    };

    MainSlidesView.prototype.slideUp = function(){
        this.slideViewItemScaleup = true;
        this.scrollviewScale.set(1,this.options.transition);
        this.scrollview.setOptions({
            paginated: true
        });
    };

    MainSlidesView.prototype.slideDown = function(){
        this.slideViewItemScaleup = false;
        this.scrollviewScale.set(0.5,this.options.transition);
        this.scrollview.setOptions({
            paginated: false
        });
    };

    MainSlidesView.prototype.setListeners = function(){
        GenericSlidesView.prototype.setListeners.call(this);

        this.collection.on('add', function(model , collection){
            //-------------------------- model add in order
            var slidesViewItem = new this.SlidesViewItem({model: model});
            this.slidesArray[model.get('index')] = slidesViewItem;
            if(this.scrollview)slidesViewItem._eventOutput.pipe(this.scrollview);
            if(this.sync)slidesViewItem._eventOutput.pipe(this.sync);
            setTimeout(function(){
                Helper.getLocalUrl(model.get('remoteURL'), model.get('index'), function(localURL){
                    model.save('localURL', localURL);
                    this.downloadedNumber += 1;
                    setting.save('downloadedRatio',model.get('fileTitle')+'/'+this.downloadedNumber + '/' + this.slidesNumber);
                    console.log(this.downloadedNumber, this.slidesNumber);
                }.bind(this));
            }.bind(this),100 + 100 * model.get('index'));
        }.bind(this));
    };

    MainSlidesView.prototype.nextPage = function(){
        this.selectByIndex(this.getSelectedPage()+1);
    };

    MainSlidesView.prototype.previousPage = function(){
        this.selectByIndex(this.getSelectedPage()-1);
    };

    module.exports = MainSlidesView;
});

