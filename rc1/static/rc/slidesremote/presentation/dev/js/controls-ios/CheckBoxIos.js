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
    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");


    /**
     * A visual representation class, skin, for a checkbox
     *
     * @class CheckBoxIos
     * @constructor
     */
    function CheckBoxIos() {
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

    CheckBoxIos.DEFAULT_OPTIONS = {
        dot: {
            size: [45, 45],
            classes: ['ios', 'checkbox-dot'],
            content: 'img/controls-ios/checkbox-dot.png'
        },
        background: {
            size: [45, 45],
            classes: ['ios', 'checkbox-background']
        },
        animation: {
            duration: 100,
            curve: Easing.outBounce
        }
    };

    CheckBoxIos.prototype = Object.create(View.prototype);
    CheckBoxIos.prototype.constructor = CheckBoxIos;

    /**
     * A method that changes the visual state
     *
     * @private
     */
    CheckBoxIos.prototype._setVisuals = function(state) {
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
    CheckBoxIos.prototype.getInAnimation = function() {
        return this._inAnimation;
    };

    /**
     * Returns the width and height of the object.
     *
     * @method getSize
     * @return { array[number, number] } width, height
     */
    CheckBoxIos.prototype.getSize = function() {
        return this.background.size();
    };

    module.exports = CheckBoxIos;
});
