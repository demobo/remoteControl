//define(function(require, exports, module) {
//    var View = require('famous/core/View');
//    var Surface = require('famous/core/Surface');
//    var Transform = require('famous/core/Transform');
//    var Modifier = require('famous/core/Modifier');
//    var StateModifier = require('famous/modifiers/StateModifier');
//    var Utility = require('famous/utilities/Utility');
//
//    var Slides = require('collections/Slides');
//    var Slide = require('models/Slide');
//    var SvgView = require('widgets/SvgView');
//
//    function GenericSlidesViewItem(options) {
//        View.apply(this, arguments);
//        this.model = options.model;
//        this.collection = options.model.collection;
//        _setListeners.call(this);
//        _createViews.call(this);
//        _setEvents.call(this);
//        _debug.call(this);
//    }
//    function _debug(){
//        window.slideViewItem = this;
//    }
//
//    GenericSlidesViewItem.prototype = Object.create(View.prototype);
//    GenericSlidesViewItem.prototype.constructor = GenericSlidesViewItem;
//
//    GenericSlidesViewItem.DEFAULT_OPTIONS = {
//        size: [window.innerWidth, window.innerHeight],
//        thumbnailSize: [window.innerWidth , window.innerHeight]
//    };
//
//    function _createViews() {
//        this.item = new Surface({
//            size: this.options.thumbnailSize,
//            properties:{
//                zIndex:2
//            }
//        });
//        this.itemMod = new Modifier({
//            origin:[0.5,0.5]
//        });
//        _setContent.call(this);
//        this.add(this.itemMod).add(this.item);
//    }
//
//    function _setEvents() {
//        this.item.on('click',function(){
//            console.log('click on slide',this.model.attributes);
//        }.bind(this));
//        this.item.pipe(this._eventOutput);
//    }
//
//    function _setListeners() {
//        this.model.on("all", function(event, model, collection){
//            if(event === 'change:timeStamp'){
//                console.log("show item animation in the future");
//            }
//            if(event == 'change:dataUrl'){
//                console.log(event, model.get('dataUrl'));
//                this.item.setContent("<div class='thumbnail'><img src='"+ model.get('dataUrl') + "'></div>")
//            }
//        }.bind(this));
//    }
//
//    function _setContent(){
//        if(this.model.get('dataUrl'))
//            this.item.setContent("<div class='thumbnail'><img src='"+ this.model.get('dataUrl') + "'></div>");
//    }
//    module.exports = GenericSlidesViewItem;
//});
//
//
