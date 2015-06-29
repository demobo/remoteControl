define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var setting = require('configs/Setting');


    function SvgView(options) {
    	this.useImg = options.useImg;
        View.apply(this, arguments);
        _createViews.call(this);
        _setListeners.call(this);
        _debug.call(this);
    }

    function _debug(){
        window.SvgView = this;
    }

    SvgView.prototype = Object.create(View.prototype);
    SvgView.prototype.constructor = SvgView;

    SvgView.DEFAULT_OPTIONS = {
        size: [640, 480],
        zIndex: 2,
        surfacesNumber: 15,
        totalTime: 10000,
        timeInterval: 1000,
        origin: [0.5, 0.5],
        align: [0.5,0.5]
    };

    function _createViews() {
        this.surface = new Surface({
            classes: ['thumbnail'],
            size: this.options.size,
            properties: {
                zIndex: 2
            }
        });
        this.add(new StateModifier({
            origin: [.5,.5]
        })).add(this.surface);
        this.surface.pipe(this._eventOutput);
    }

    function _setListeners(){
        this.surface.on('click', function(){
            this._eventOutput.emit('click');
        }.bind(this));
    }

    SvgView.prototype.updateWithUrl =  function(dataUrl){
    	if (this.useImg) {
    		 this.surface.setContent('<div><img src="' + dataUrl + '"></img></div>');
    	} else {
	    	Snap.load(dataUrl, function(svgData){
	            if(this.snap){
	                this.snap.clear();
	            } else {
	                this.snap = new Snap();
	            }
	            this.snap.append(svgData);
	            this.animateQueue = _.filter(this.snap.selectAll('path'), function(svgPath){
	                return svgPath.node.outerHTML.length > 600;
	            });
	            _handlerLinks.call(this);
	            this.surface.setContent($('<div></div>').append(this.snap.node)[0]);
	        }.bind(this));	
    	}
    };

    function _handlerLinks(){
        _(this.snap.selectAll('a')).each(function(el){
            var link = $(el.node.outerHTML).attr('xlink:href');
            el.node.onclick = function(e){
                e.preventDefault();
                navigator.app.loadUrl(link, { openExternal:true });
            };
        });
    }



    SvgView.prototype.prepareAnimate = function(){
        _.each(this.animateQueue, function(svg){
            console.log(svg, 0)
            svg.animate({transform:svg.transform().localMatrix.translate(0, -500, 0), opacity:0}, 100);
        });
    };

    SvgView.prototype.doAnimate = function(){
        if(this.animateQueue.length !== 0 && setting.get('animation') === 'on'){
            var svg = this.animateQueue.shift();
            svg.
                animate({transform:svg.transform().localMatrix.translate(0, 500, 0), opacity:1}, 2000, mina.bounce);
        }
    };

    SvgView.prototype.reset = function(){
        if(this.svg) this.svg.clear();
    };

    function _resizeSVG(d){
        this.snap.append(d);
        window.d = d;
        var bbox = d.paper.getBBox();
        this.snap.attr({
            width: this.options.size[0],
            height: this.options.size[1],
            viewBox:"0 0 " + bbox.width + " " + bbox.height,
            preserveAspectRatio:"xMidYMid meet"
        });
        console.log("svg w and h: ", bbox.width, bbox.height);
    }


    function _createSVG(){
        this.leaves = _(this.snap.selectAll('rect,path,line,use,circle')).toArray();
        this.from = _(this.leaves).map(function(item, index) {
            var v = index%2?90:-90;
            return {
                transform: item.transform().totalMatrix.rotate(v,0,0),
                opacity: 0
            };
        });
        this.to = _(this.leaves).map(function(item) {
            return {
                transform: item.transform().localMatrix,
                opacity:1
            };
        });
        _.each(this.leaves, function(item, index){
            item.animate(this.from[index], 0);
        }.bind(this));
        window.leaves = this.leaves;
        window.to = this.to;
    }

    function _show(){
        this.interval = (this.options.totalTime / this.leaves.length > this.options.timeInterval)? this.options.timeInterval:
            Math.floor(this.options.totalTime / this.leaves.length);
        _helpShow.call(this);
    }

    function _helpShow(){
        if(this.leaves.length > 0){
            this.timer = setTimeout(function(){
                if(! this.p){
                    var leaf = this.leaves.shift();
                    Helper.playSound('tick');
                    var animateInterval = (this.interval > 800) ? 800: this.interval;
                    leaf.animate(this.to.shift(), animateInterval, mina.bounce);
                    console.log("svg leaf:", leaf.type, leaf)
                }
                _helpShow.call(this);
            }.bind(this), this.interval)
        }
    }

    SvgView.prototype.pause = function(){
        console.log('pause');
        this.p = true;
    };

    SvgView.prototype.resume = function(){
        console.log('resume')
        this.p = false;
    };

    module.exports = SvgView;
});