/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: Brian Chu
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var Easing = require('famous/transitions/Easing');
    var FilledBar = require('controls/FilledBar');

    /**
     * ProgressBar is a FilledBar with a progress (percentage) label. Comes with default styles that can be overrided with other frameworks (e.g. Bootstrap). See controls.css.
     *
     * @class ProgressBar
     * @constructor
     * @param {Object} [options] An object of configurable options.
     * @param {Array|Number} [options.size] Size of bar.
     * @param {Transition} [options.transition] Transition for fill. Default: Easing.inOutCubic with duration of 2000. 
     * @param {Number} [options.labelPadding=6] Offset between edge of bar fill and label.
     * @param {Array|String} [options.labelClasses] CSS classes for label. Default: ['bar-label']
     * @param {Array|String} [options.classes] 
     * @param {String} [options.unit='%'] Unit to show in label. 
     * @param {Number} [options.precision=0] Number of decimal places to show in label. Must be between 0 and 20, inclusive.
     * @param {Object} [options.filledBar] Advanced: Object of options accepted by FilledBar.
     *
     * @readOnly
     * @property {FilledBar} [this.bar] FilledBar instance
     * @readOnly
     * @property {Surface} [this.label] Label
     */
    function ProgressBar() {
        View.apply(this, arguments);
        var opts = this.options;

        opts.filledBar = opts.filledBar || {};
        opts.filledBar.size = opts.size;
        this.bar = new FilledBar(opts.filledBar);
        this.add(this.bar);

        this.label = new Surface({
            size: [true, true],
            classes: opts.labelClasses,
            content: '0' + opts.unit
        });

        // keep label next to fill, and calculate which side of fill to appear on
        var position = new Modifier({
            align: [1, 0.5],
            origin: function() {
                return this._hasSpaceForLabel() ? [1, 0.5] : [0, 0.5];
            }.bind(this),
            transform: function() {
                this.updateLabel();
                var pos = this._hasSpaceForLabel() ? -opts.labelPadding : opts.labelPadding;
                return Transform.translate(pos, 0, 0);
            }.bind(this)
        });
        this.bar.fillPositionNode.add(position).add(this.label);
    }

    ProgressBar.prototype = Object.create(View.prototype);
    ProgressBar.prototype.constructor = ProgressBar;
    ProgressBar.DEFAULT_OPTIONS = {
        size: [300, 24],
        transition: {duration: 2000, curve: Easing.inOutCubic},
        labelPadding: 6,
        labelClasses: ['bar-label'],
        classes: [''],
        unit: '%',
        precision: 0 // between 0 and 20, inclusive
    };

    ProgressBar.prototype._hasSpaceForLabel = function _hasSpaceForLabel() {
        var width = this.label.getSize(true); // true = get computed style, rather than provided
        width = width && width[0];
        var emptyFillSpace = this.options.size[0] - this.bar.getPosition() - this.options.labelPadding;
        return width > emptyFillSpace;
    };

    ProgressBar.prototype.updateLabel = function updateLabel() {
        var percent = (this.getProportion() * 100).toFixed(this.options.precision);
        this.label.setContent(percent + this.options.unit);
    };

    /**
     * Set progress fraction.
     * @method setProportion
     * @param {Number} [proportion] Float between than 0 and 1, inclusive
     * @param {Transition} [transition] Transition for progress bar fill. The duration of the transition is multiplied by the difference between the current proportion and the parameter proportion.
     * @param {Function} [callback] Callback for when transition finishes
     */
    ProgressBar.prototype.setProportion = function setProportion(proportion, transition, callback) {
        transition = transition || this.options.transition;
        transition = Object.create(transition);
        var prop = transition.duration ? 'duration' : 'period';
        transition[prop] = transition[prop] * Math.abs(this.getProportion() - proportion);
        this.bar.setProportion(proportion, transition, callback);
    };
    /**
     * Get proportional progress
     * @method getProportion
     * @return {Number} proportion (between 0 and 1)
     */
    ProgressBar.prototype.getProportion = function getProportion() {
        return this.bar.getProportion();
    };
    module.exports = ProgressBar;
});
