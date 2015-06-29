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
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transitionable = require('famous/transitions/Transitionable');

    /**
     * A visual representation class, skin, for a checkbox
     *
     * @class CheckBoxAndroid
     * @constructor
     */
    function CheckBoxAndroid() {
        View.apply(this, arguments);

        this.dot = new ImageSurface(this.options.dot);
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
                var zTranslation = this.transitionable.get();
                return Transform.translate(0, 0, zTranslation);
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

    CheckBoxAndroid.DEFAULT_OPTIONS = {
        dot: {
            size: [41, 41],
            classes: ['android', 'checkbox-dot'],
            content: 'img/controls-android/checkbox-dot.png'
        },
        background: {
            size: [41, 41],
            classes: ['android', 'checkbox-background']
        },
        animation: {
            duration: 100,
            curve: Easing.outBounce
        }
    };

    CheckBoxAndroid.prototype = Object.create(View.prototype);
    CheckBoxAndroid.prototype.constructor = CheckBoxAndroid;

    /**
     * A method that changes the visual state
     *
     * @private
     */
    CheckBoxAndroid.prototype._setVisuals = function(state) {
        var z;
        this._inAnimation = true;
        if (state) {
            z = 1;
        } else {
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
    CheckBoxAndroid.prototype.getInAnimation = function() {
        return this._inAnimation;
    };

    /**
     * Returns the width and height of the object.
     *
     * @method getSize
     * @return { array[number, number] } width, height
     */
    CheckBoxAndroid.prototype.getSize = function() {
        return this.background.size();
    };

    module.exports = CheckBoxAndroid;
});
