define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require('famous/views/Scrollview');
    var Utility = require('famous/utilities/Utility');

    function FileScrollview(options) {
        View.apply(this, arguments);
        this.collection = options.collection;
        _createViews.call(this);
        _setListeners.call(this);
        _debug.call(this);
    }
    function _debug(){
        window.FileScrollview = this;
    }


    FileScrollview.prototype = Object.create(View.prototype);
    FileScrollview.prototype.constructor = FileScrollview;

    FileScrollview.DEFAULT_OPTIONS = {
        itemSize : [undefined,70]
    };

    function _createViews() {
        this.background = new Surface({
            size: [window.innerWidth, window.innerHeight],
            classes: ['fileBackground'],
            properties:{
                zIndex: -1
            }
        });
        this.items = [];
        this.scrollview = new Scrollview({
            direction: Utility.Direction.Y
        });
        this.scrollview.sequenceFrom(this.items);
        //this.add(this.scrollview);
        // TODO changed here
        this.add(this.background)
        this.add(new StateModifier({align:[0, 0]})).add(this.scrollview);

    }

    function _setListeners() {
        this.collection.on('all', function(event, collection){
            if(event == 'sync'){
//                this.collection = this.collection.filter(function(model){
//                    return model.get("mimeType") === "application/vnd.google-apps.presentation";
//                });
                console.log(collection);
                collection.forEach(function(model){
                    _addItem.call(this, model);
                }.bind(this))
            }
            if(event == 'reset'){
                while(this.items.length !== 0){
                    this.items.pop();
                }
            }

        }.bind(this))
    }

    function _addItem(model){
        var html = $('#file-item-view').html();
        html = Mustache.render(html, model.getTemplateData());
        var item = new Surface({
            size: this.options.itemSize,
            content: html
//            properties:{
//                background: 'yellow',
//                color: 'black',
//                fontSize: '20pz'
//            }
        });
        item.pipe(this.scrollview);
        item.on('click',function(e){
            model.set('timeStamp', Date.now());
            this.items.map(function(i){
                i.setClasses([]);
            });
            item.setClasses(['selected']);
            // here click one will open or download file
        }.bind(this));
        this.items.push(item);
    }
    FileScrollview.prototype.reset = function(){
        console.log(this.collection);
        this.collection.reset();
    }

    module.exports = FileScrollview;
});


