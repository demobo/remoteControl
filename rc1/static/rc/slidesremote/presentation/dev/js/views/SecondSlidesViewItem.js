define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Utility = require('famous/utilities/Utility');

    var Slides = require('collections/Slides');
    var Slide = require('models/Slide');
    var SvgView = require('widgets/SvgView');
    var setting = require('configs/Setting');


    function SlidesViewItem(options) {
        View.apply(this, arguments);
        this.model = options.model;
        this.collection = options.model.collection;
        _setListeners.call(this);
        _createViews.call(this);
        _setEvents.call(this);
        _debug.call(this);
    }
    function _debug(){
        window.slideViewItem = this;
    }

    SlidesViewItem.prototype = Object.create(View.prototype);
    SlidesViewItem.prototype.constructor = SlidesViewItem;

    SlidesViewItem.DEFAULT_OPTIONS = {
        size: [window.innerWidth, window.innerHeight],
        thumbnailSize: [window.innerHeight*4/3 , window.innerHeight]
    };

    function _createViews() {
        this.item = new SvgView({
            size: this.options.thumbnailSize,
            id: this.model.get('id')
        });
        this.itemMod = new Modifier({
//            origin:[0.5,0.5],
            size: this.options.size
        });
        this.updateContent.call(this);
        this.add(this.itemMod).add(this.item);
    }

    function _setEvents() {
        this.item.pipe(this._eventOutput);
    }

    function _setListeners() {
        this.model.on("all", function(event, model, collection){
            if(event === 'change:timeStamp'){
                console.log("show item animation in the future", model);
            }
            if(event == 'change:localURL'){
                if(model.get('localURL')) {
                    //----------------------------------
//                    this.item._eventOutput.emit('slidesDownloaded');
                    //---------------------------------
                    this.item.updateWithUrl(model.get('localURL'));
                }
            }
        }.bind(this));
    }

    SlidesViewItem.prototype.updateContent = function(){
        if(this.model.get('localURL')) {
            this.item.updateWithUrl(this.model.get('localURL'));
            if(setting.get('animation') === 'on'){
                setTimeout(function(){
                    this.item.prepareAnimate();
                }.bind(this), 1000)
            }
        }
    }

    SlidesViewItem.prototype.addClass = function(classNames) {
        var target = $(this.item.surface._currTarget);
        target.find('div').attr('class', classNames);
    };

    SlidesViewItem.prototype.show = function(classNames, isBackward) {
        if (isBackward)
            classNames = _reverseClasses(classNames);
        var target = $(this.item.surface._currTarget).find('div');
        var html = target.html();
        var $nextPage = $('.pt-page-hide').last();
        $nextPage.html(html).attr('class', "pt-page pt-page-hide pt-page-current " +classNames).on( 'webkitAnimationEnd', function() {
            $nextPage.off( 'webkitAnimationEnd' );
            $nextPage.attr('class', "pt-page pt-page-show pt-page-current");
        } );
    };

    SlidesViewItem.prototype.hide = function(classNames, isBackward) {
        if (isBackward)
            classNames = _reverseClasses(classNames);
        var $nextPage = $('.pt-page-show').last();
        $nextPage.attr('class', "pt-page pt-page-show pt-page-current " +classNames).on( 'webkitAnimationEnd', function() {
            $nextPage.off( 'webkitAnimationEnd' );
            $nextPage.attr('class', "pt-page pt-page-hide");
        } );
    };

    function _reverseClasses(classNames) {
        if (classNames.match('Top'))
            classNames = classNames.replace("Top", "Bottom");
        else
            classNames = classNames.replace("Bottom", "Top");
        if (classNames.match('Left'))
            classNames = classNames.replace("Left", "Right");
        else
            classNames = classNames.replace("Right", "Left");
        return classNames;
    }

    module.exports = SlidesViewItem;
});


