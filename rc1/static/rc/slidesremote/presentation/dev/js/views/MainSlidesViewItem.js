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
    var Helper = require('configs/Helper');

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
        size: [window.innerWidth, window.innerHeight/2],
        noteSize: [window.innerWidth , window.innerHeight],
        thumbnailSize: [window.innerWidth , window.innerWidth*3/4]
    };

    function _createViews() {
        this.item = new SvgView({
            size: this.options.thumbnailSize,
            id: this.model.get('id'),
            useImg: true
        });
        
        this.itemMod = new Modifier({
            size: this.options.thumbnailSize,
            origin:[0.5,1]
        });
        this.note = new Surface({
            size: this.options.noteSize,
            properties:{
                zIndex:1
            }
        });
        this.noteMod = new Modifier({
            origin:[0.5,0]
        });
        this.updateContent.call(this);
        //this.note.setContent("<div class='note'><div>"+ "NA" + "</div></div>");
        this.add(this.noteMod).add(this.note);
        this.add(this.itemMod).add(this.item);
    }

    function _setEvents() {
        this.on('click',function(){
            this.model.save('timeStamp', Date.now());
            demobo.mobile.fireInputEvent('notesSlider', this.model.get('index')+1);
            console.log('click on slide',this.model);
        }.bind(this));
        this.note.pipe(this._eventOutput);
        this.item.pipe(this._eventOutput);
    }

    function _setListeners() {
        this.model.on("all", function(event, model, collection){
            console.log(event, model, collection);
            if(event === 'change:timeStamp'){

            }
            //---------------- fix mix page bug here , maybe be sync lead
//            if(event == 'change:remoteURL'){
//                if(model.get('remoteURL')) {
//                    Helper.getLocalUrl(model.get('remoteURL'),model.get('index'), function(localURL){
//                        model.save('localURL', localURL);
//                    });
//                }
//            }
            //---------------- this is not necessary
            if(event == 'change:localURL'){
                if(model.get('localURL')) this.item.updateWithUrl(model.get('localURL'));
            }

            //-----------------
            if (event == 'change:notes'){
                _setNote.call(this);
            }
            // ----------------------------
            if(event == 'destroy'){
                this.item.reset();
            }
        }.bind(this));
    }

    SlidesViewItem.prototype.updateContent = function(){
        if(this.model.get('localURL')){
            this.item.updateWithUrl(this.model.get('localURL'));
        }
//        else if(this.model.get('remoteURL')){
//            Helper.getLocalUrl(this.model.get('remoteURL'), this.model.get('index') , function(localURL){
//                this.model.save('localURL', localURL);
//            }.bind(this));
//        }
        if(this.model.get('notes')){
            _setNote.call(this);
        }
    };

    function _setNote() {
        if (this.model.get('notes')) {
            var pageNumber = this.model.get('index')+1;
            this.note.setContent('<div class="note"><div class="pageNumber">' + (1+this.model.get('index')) + '</div><div class="smallNote">'
                + this.model.get('notes') + "</div></div>");
        }
    }

    module.exports = SlidesViewItem;
});

