/*
 * @author Sebastian Miller-Hack
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Easing = require('famous/transitions/Easing');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');

    ToggleIos.DEFAULT_OPTIONS = {
        dot: {
            size: [56, 56],
            classes: ['ios', 'toggle-slider']
        },
        tab: {
            size: [99, 58],
            classes: ['ios', 'toggle-tab']
        },
        background: {
            size: [103, 62],
            classes: ['ios', 'toggle-bg', 'on']
        },
        animation: {
            duration: 200,
            curve: Easing.outSine
        }
    };

    /**
     * A visual representation class, skin, for a Toggle
     *
     * @class ToggleIos
     * @constructor
     */
    function ToggleIos() {
        View.apply(this, arguments);

        this.dot = new Surface(this.options.dot);

        this.tab = new Surface(this.options.tab);
        this.background = new Surface(this.options.background);

        this.transitionable = new Transitionable(0);

        this.dotModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: function() {
                var trans = this.transitionable.get();
                var sizeBG = this.options.background.size;
                var sizeDot = this.options.dot.size;
                var xTranslation = (trans) * (sizeBG[0] - sizeDot[0] - (sizeBG[1] - sizeDot[1])) - (sizeBG[0] - sizeDot[0]) * 0.5 + (sizeBG[1] - sizeDot[1]) * 0.5;
                return Transform.translate(xTranslation-3, -3, 0);
            }.bind(this)
        });

        this.tabModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: function() {
                var trans = 1 - this.transitionable.get();
                //var sizeBG = this.options.background.size;
                //var sizeDot = this.options.dot.size;
                //var scale = (trans*.5)*(sizeBG[0]-sizeDot[0]-(sizeBG[1]-sizeDot[1]));
                return Transform.scale(trans, trans, 0);
            }.bind(this)
        });

        this.bgModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5]
        });

        this.add(this.dotModifier).add(this.dot);
        this.add(this.tabModifier).add(this.tab);
        this.add(this.bgModifier).add(this.background);

        this._eventInput.on('toggle:checked', function(data) {
            this._setVisuals(data);
        }.bind(this));

        this._eventInput.on('disabled', function(data) {
            if (data) {
                this.dot.addClass('disabled');
                this.background.addClass('disabled');
            } else {
                this.dot.removeClass('disabled');
                this.background.removeClass('disabled');
            }
        }.bind(this));

        this.background.on('click', function() {
            this._eventOutput.emit('click');
        }.bind(this));
    }

    ToggleIos.prototype = Object.create(View.prototype);
    ToggleIos.prototype.constructor = ToggleIos;

    /**
     * A method that changes the visual state
     *
     * @private
     */
    ToggleIos.prototype._setVisuals = function(state) {
        var z;
        this._inAnimation = true;
        if (state) {
            this.background.removeClass('off');
            this.background.addClass('on');
            z = 1;
        } else {
            this.background.removeClass('on');
            this.background.addClass('off');
            z = 0;
        }
        this.transitionable.set(
            z,
            this.options.animation,
            function() {
                this._inAnimation = false;
            }.bind(this)
        );
    };

    /**
     * Returns true if an animation is in progress.
     *
     * @method getInAnimation
     * @return {boolean}
     */
    ToggleIos.prototype.getInAnimation = function() {
        return this._inAnimation;
    };

    /**
     * Returns the width and height of the object.
     *
     * @method getSize
     * @return { array[number, number] } width, height
     */
    ToggleIos.prototype.getSize = function() {
        return this.background.size();
    };

    module.exports = ToggleIos;
});