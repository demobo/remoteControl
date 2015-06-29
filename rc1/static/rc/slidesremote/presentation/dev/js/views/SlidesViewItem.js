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
//    function SlidesViewItem(options) {
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
//    SlidesViewItem.prototype = Object.create(View.prototype);
//    SlidesViewItem.prototype.constructor = SlidesViewItem;
//
//    SlidesViewItem.DEFAULT_OPTIONS = {
//        size: [window.innerWidth, window.innerHeight/2],
//        noteSize: [window.innerWidth , window.innerHeight],
//        thumbnailSize: [window.innerWidth , window.innerWidth*3/4]
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
//            origin:[0.5,1]
//        });
//        this.note = new Surface({
//            size: this.options.noteSize,
//            properties:{
//                zIndex:1
//            }
//        });
//        this.noteMod = new Modifier({
//            origin:[0.5,0]
//        });
//        _setContent.call(this);
//        this.add(this.noteMod).add(this.note);
//        this.add(this.itemMod).add(this.item);
//    }
//
//    function _setEvents() {
//        this.item.on('click',function(){
//            console.log('click on slide',this.model.attributes.content);
//        }.bind(this));
//        this.note.pipe(this._eventOutput);
//        this.item.pipe(this._eventOutput);
//    }
//
//    function _setListeners() {
//       // TODO add note surface;
//       this.model.on("all", function(event, model, collection){
//           if(event === 'change:timeStamp'){
//               //this.item.setContent("<div class='thumbnail'></div>");
//               //this.note.setContent("<div class='note'><div></div></div>");
//           }
//           if(event == 'change:dataUrl'){
//               this.item.setContent("<div class='thumbnail'><img src='"+ this.model.get('dataUrl') + "'></div>");
//           }
//           if (event == 'change:notes'){
//               this.note.setContent("<div class='note'><div>"+ this.model.get('notes') + "</div></div>");
//           }
//       }.bind(this));
//    }
//
//    function _setContent(){
//        console.log('<div> class="thumbnail" ' + "<img src='" + this.model.get('dataUrl') + "' ></div>");
//        if(this.model.get('dataUrl'))this.item.setContent("<div class='thumbnail'><img src='"+ this.model.get('dataUrl') + "'></div>");
//        if(this.model.get('notes'))this.note.setContent("<div class='note'><div>"+ this.model.get('notes') + "</div></div>");
////        Snap.load(this.model.src, function (d) {
////            this.snap = Snap('#svg').append(d);
////            var bbox = d.paper.getBBox();
////            this.snap.attr({
////                width: this.options.size[0],
////                height: this.options.size[1],
////                viewBox:"0 0 " + bbox.width + " " + bbox.height,
////                preserveAspectRatio:"xMidYMid meet"
////            });
////        });
//        //window.c = this.model.collection;
//    }
////    SlidesViewItem.prototype.setModel = function (model){
//////        if(this.model){
//////            this.model.destroy();
//////        }
////        this.model = model;
////        this.collection = this.model.collection;
////        //_setListeners.call(this);
////        _setContent.call(this);
//////        _createViews.call(this);
//////        _setContent.call(this);
//////        _setEvents.call(this);
//////        _setListeners.call(this);
//////        _debug.call(this);
////        return this;
////    }
//    module.exports = SlidesViewItem;
//});
//
//
