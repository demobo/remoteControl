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

    /**
     * A visual representation class, skin, for a checkbox
     *
     * @class ToggleAndroid
     * @constructor
     */
    function ToggleAndroid() {
        View.apply(this, arguments);

        this.dot = new Surface(this.options.dot);

        this.background = new Surface(this.options.background);

        this.transitionable = new Transitionable(0);

        this.bgModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5]
        });

        this.dotModifier = new Modifier({
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: function() {
                var xTranslation = this.transitionable.get() * (this.options.background.size[0] - this.options.dot.size[0]) / 2;
                return Transform.translate(xTranslation, 0, 0);
            }.bind(this)
        });

        this.add(this.dotModifier).add(this.dot);
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

    ToggleAndroid.prototype = Object.create(View.prototype);
    ToggleAndroid.prototype.constructor = ToggleAndroid;

    ToggleAndroid.DEFAULT_OPTIONS = {
        dot: {
            size: [84, 42],
            classes: ['android', 'toggle-slider'],
            content: 'ON'
        },
        background: {
            size: [168, 42],
            classes: ['android', 'toggle-background']
        },
        animation: {
            duration: 10,
            curve: Easing.outBounce
        },
        contentTrue: 'ON',
        contentFalse: 'OFF'
    };
    /**
     * A method that changes the visual state
     *
     * @private
     */
    ToggleAndroid.prototype._setVisuals = function(state) {
        this._inAnimation = true;
        var z;
        if (state) {
            this.dot.removeClass('off');
            this.dot.addClass('on');
            this.dot.setContent(this.options.contentTrue);
            z = 1;
        } else {
            this.dot.removeClass('on');
            this.dot.addClass('off');
            this.dot.setContent(this.options.contentFalse);
            z = -1;
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
    ToggleAndroid.prototype.getInAnimation = function() {
        return this._inAnimation;
    };

    /**
     * Returns the width and height of the object.
     *
     * @method getSize
     * @return { array[number, number] } width, height
     */
    ToggleAndroid.prototype.getSize = function() {
        return this.background.size();
    };

    module.exports = ToggleAndroid;
});
