/*
 * @author Sebastian Miller-Hack
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Easing = require('famous/transitions/Easing');
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var GenericSync = require('famous/inputs/GenericSync');
    var EventHandler = require('famous/core/EventHandler');
    var Transitionable = require('famous/transitions/Transitionable');

    GenericSync.register({
        'mouse': MouseSync,
        'touch': TouchSync
    });

    /**
     * A visual representation class, skin, for a checkbox
     *
     * @class RangeAndroid
     * @constructor
     */
    function RangeAndroid() {
        View.apply(this, arguments);

        this.dot = new Surface(this.options.dot);
        this.bar = new Surface(this.options.bar);
        this.background = new Surface(this.options.background);

        this.transitionable = new Transitionable(0.5);

        this.dotModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: function() {
                var xTranslation = this.transitionable.get() * this.options.background.size[0] - this.options.background.size[0] / 2;
                return Transform.translate(xTranslation, 0, 0);
            }.bind(this)
        });

        this.barModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: function() {
                var length = this.options.background.size[0];
                var percent = this.transitionable.get();
                var left = -length / 2;
                var right = percent * length - length / 2;
                var xTranslation = (left + right) / 2
                return Transform.multiply(Transform.translate(xTranslation, 0, 0), Transform.scale(percent, 1, 1));
            }.bind(this)
        });

        this.bgModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5]
        });

        this.add(this.dotModifier).add(this.dot);
        this.add(this.barModifier).add(this.bar);
        this.add(this.bgModifier).add(this.background);

        this._eventInput.on('change:position', function(percent) {
            this._setPositionVisuals(percent);
        }.bind(this));

        this._eventInput.on('disabled', function(isDisabled) {
            this._setDisabledVisuals(isDisabled);
        }.bind(this));

        this.sync = new GenericSync({
            'mouse': {},
            'touch': {},
        });

        this.dot.pipe(this.sync);

        this.sync.on('update', function(data) {
            var deltaPixels = data.delta[0]
            this._eventOutput.emit('dragged', deltaPixels);
        }.bind(this));
    }

    RangeAndroid.DEFAULT_OPTIONS = {
        dot: {
            size: [20, 20],
            classes: ['android', 'range-dot']
        },
        bar: {
            size: [570, 6],
            classes: ['android', 'range-bar']
        },
        background: {
            size: [570, 4],
            classes: ['android', 'range-background']
        },
        animation: {
            duration: 0,
            curve: Easing.outBounce
        },
    };

    RangeAndroid.prototype = Object.create(View.prototype);
    RangeAndroid.prototype.constructor = RangeAndroid;

    /**
     * A method that changes the visual state
     *
     * @private
     */
    RangeAndroid.prototype._setDisabledVisuals = function(isDisabled) {
        if (isDisabled) {
            this.dot.addClass('disabled');
            this.background.addClass('disabled');
        } else {
            this.dot.removeClass('disabled');
            this.background.removeClass('disabled');
        }
    };

    /**
     * A method that changes the visual state
     *
     * @private
     */
    RangeAndroid.prototype._setPositionVisuals = function(percent) {
        this._inAnimation = true;
        this.transitionable.set(percent);
    };

    /**
     * Returns true if an animation is in progress.
     *
     * @method getInAnimation
     * @return {boolean}
     */
    RangeAndroid.prototype.getInAnimation = function() {
        return this._inAnimation;
    };

    /**
     * Returns the width and height of the object.
     *
     * @method getSize
     * @return { array[number, number] } width, height
     */
    RangeAndroid.prototype.getSize = function() {
        return this.background.size();
    };

    module.exports = RangeAndroid;
});
