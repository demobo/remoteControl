define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Utility = require('famous/utilities/Utility');

    var setting = require('configs/Setting');


    function LoadingbarView(options) {
        View.apply(this, arguments);
        this.slidesTransitionable = options.slidesTransitionable;
        _createViews.call(this);
        _setListeners.call(this);
        _debug.call(this);
    }
    function _debug(){
        window.LoadingbarView = this;
    }



    LoadingbarView.prototype = Object.create(View.prototype);
    LoadingbarView.prototype.constructor = LoadingbarView;

    LoadingbarView.DEFAULT_OPTIONS = {
        backgroundSize:[window.innerWidth, window.innerHeight* 0.3],
        loadingbarViewSize:[window.innerWidth *0.6, window.innerHeight* 0.1],
        titleViewSize: [window.innerWidth *0.6, window.innerHeight* 0.1]
    };

    function _createViews() {
//        this.background = new Surface({
//            size: this.options.backgroundSize,
//            properties:{
//                backgroundColor:'#CFCDB4'
//            }
//        });
//        this.add(this.background);
        this.loadingbarViewMod = new Modifier({
            origin: function(){return [.5,.5]},
            align: function() {return [.5,.5]}

        });
        this.loadingbarViewMod.opacityFrom(function(){
            return 1 - Math.abs(1 - this.slidesTransitionable.get());
        }.bind(this))
        this.loadingbarSurface = new Surface({
            size: this.options.loadingbarViewSize,
            properties: {
                zIndex: 10,
                textAlign:'center',
                backgroundColor: 'transparent',
                color: '#413E3F',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '20px',
                lineHeight: '50px'

                //border: '#817F80 solid 3px'
            }
        });
        this.titleMod =  new Modifier({
            origin: function(){return [.5,.5]},
            align: function(){return [.5,.45]}
        });

        if(this.options.isSecondScreen){
            this.titleMod.opacityFrom(function(){
                return 1 - Math.abs(1 - this.slidesTransitionable.get());
            }.bind(this))
        }

        this.titleSurface = new Surface({
            size: this.options.titleViewSize,
            properties: {
                zIndex: 10,
                textAlign:'center',
                backgroundColor: 'transparent',
                color: '#413E3F',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '20px',
                fontWeight: 'bold',
                lineHeight: '50px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '100%',
                textTransform: 'capitalize'
                //border: '#817F80 solid 3px'
            }
        });
        this.add(this.titleMod).add(this.titleSurface);
        this.add(this.loadingbarViewMod).add(this.loadingbarSurface);
    }
    function _setListeners(){
        setting.on('change:downloadedRatio', function(settingModel, ratio){
            console.log(ratio);
            this.updateWithRatio(ratio);
            if(parseInt(ratio.split('/')[1]) === parseInt(ratio.split('/')[2])){
                this._eventOutput.emit('allDownloaded');
            }
        }.bind(this))

        this.titleSurface.pipe(this._eventOutput);
        this.loadingbarSurface.pipe(this._eventOutput);
//        this.background.pipe(this._eventOutput);
    }

    LoadingbarView.prototype.updateWithRatio =  function(ratio){
        console.log(ratio);
        var ratioData = ratio.split('/');
        var slidesNumber = parseInt(ratioData[2]);
        var downloadedNumber = parseInt(ratioData[1]);
        var result = Math.round(downloadedNumber/slidesNumber * 100)+'';
        var bar = '<progress value="0" max="100"> </progress>'
        $('progress').attr('value', result);

        var fileTitle = ratioData[0];
        this.loadingbarSurface.setContent(bar);
        this.titleSurface.setContent(fileTitle);
    }

    module.exports = LoadingbarView;
});


