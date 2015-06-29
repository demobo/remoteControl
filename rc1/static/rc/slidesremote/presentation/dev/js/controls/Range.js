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
    var FilledBar = require('controls/FilledBar');
    var Transitionable = require('famous/transitions/Transitionable');
    var SnapTransition = require("famous/transitions/SnapTransition");
    Transitionable.registerMethod('snap', SnapTransition);

    var GenericSync = require('famous/inputs/GenericSync');
    var MouseSync   = require('famous/inputs/MouseSync');
    var TouchSync   = require('famous/inputs/TouchSync');
    GenericSync.register({
        mouse : MouseSync,
        touch : TouchSync
    });

    /**
     * Range is a slider control. It is a replacement for input[type='range']. Mouse/touch events on the slider control button are emitted by this object. It uses FilledBar to implement the colored bar. Comes with default styles that can be overrided with other frameworks (e.g. Bootstrap). See controls.css.
     *
     * @class Range
     * @constructor
     * @param {Object} [options] An object of configurable options.
     * @param {Array<Number>} [options.size] Size of slider bar. Default: [200, 18]
     * @param {Number} [options.rangePadding] Difference between the height of the slider button and the height of the slider bar. Default: 6
     * @param {Number} [options.ticks] Number of slider ticks (the slider will snap to these ticks)/ Default: 0
     * @param {Boolean} [options.alwaysSnap] Whether the slider will snap to the nearest tick, even if the user is still dragging the slider. Default: true.
     * @param {Transition} [options.transition] Transition shown when snapping slider control to each tick. By default, velocity is set by the GenericSync. Provide your own velocity to override. Default: SnapTransition with period of 80, damping of 0.3, and velocity provided from the Sync event.
     * @param {Array|String} [options.ctrlClasses] CSS classes for the slider control. Default: ['range-ctrl']
     * @param {String} [options.activeClass] CSS classes for the slider control when pressed. Default: 'active'
     *
     * @readOnly
     * @property {Number} [this.width] The width of the slider bar (not the total width of the control!)
     * @readOnly
     * @property {Boolean} [this.isSet] Whether the slider control has snapped to the nearest tick yet.
     * @readOnly
     * @property {Surface} [this.control] The slider control button.
     * @readOnly
     * @property {Surface} [this.bar] The FilledBar instance.
     * @property {Transitionable} [this.position] Transitionable for position of slider control button relative to starting point.
     */
    function Range() {
        View.apply(this, arguments);
        var opts = this.options;
        var totalWidth = opts.size[0];
        var height = opts.size[1];

        this.isSet = true;

        var size = new StateModifier({
            size: opts.size
        });
        this._node = this.add(size); // overrides this._node

        this._ctrlSize = height + opts.rangePadding;
        this.width = totalWidth - this._ctrlSize;
        this.control = new Surface({
            size: [this._ctrlSize, this._ctrlSize],
            classes: opts.ctrlClasses
        });
        this.bar = new FilledBar({
            size: [this.width, height],
            isVisibleAtZero: true,
            clip: false
        });

        if (opts.ticks) {
            this._tickIncrement = this.width / opts.ticks;
            this._tickThreshold = this._tickIncrement / 2;
        }

        this.position = this.bar.position;
        var positionMod = new Modifier({
            origin: [0, 0.5],
            transform : function(){
                var pos = this.getPosition();
                return Transform.translate(pos, 0, 1e-3);
            }.bind(this)
        });

        var center = new StateModifier({
            origin: [0.5, 0.5]
        });
        this.add(center).add(this.bar);
        this.add(positionMod).add(this.control);

        var drag = this.drag = new GenericSync(
            ["mouse", "touch"],
            {direction : GenericSync.DIRECTION_X}
        );
        var tap = new GenericSync(
            ["mouse", "touch"],
            {direction : GenericSync.DIRECTION_X}
        );
        drag.on('start', _dragStart.bind(this));
        drag.on('update', _update.bind(this));
        drag.on('end', _end.bind(this));
        tap.on('start', _tapStart.bind(this));
        this._tapped = false; // used by _tapStart and _dragStart

        this.control.pipe(drag);
        this.bar.pipe(tap); // range bar taps: only 'start' event is handled
        this.bar.pipe(drag);

        this.control.pipe(this._eventOutput);
    }

    Range.prototype = Object.create(View.prototype);
    Range.prototype.constructor = Range;
    Range.DEFAULT_OPTIONS = {
        size: [200, 18],
        rangePadding: 10,
        ticks: 0,
        alwaysSnap: true,
        transition: {
            method : 'snap',
            period : 80,
            dampingRatio: 0.2
        },
        ctrlClasses:['range-ctrl'],
        activeClass: 'active'
    };

    var _tapStart = function _tapStart(data) {
        this._tapped = true;
        this._startHelper(data.offsetX);
        this._snap(data.offsetX, data.velocity);
    };
    var _dragStart = function _dragStart(data) {
        if (this._tapped) {
            this._tapped = false;
            return;
        }
        this._startHelper(this.getPosition());
    };
    Range.prototype._startHelper = function _startHelper(pos) {
        this.isSet = false;
        this._startCtrlPosition = pos;
        this.control.addClass(this.options.activeClass);
    };

    var _update = function _update(data){
        this.isSet = false;
        this._startCtrlPosition += data.delta;
        var pos = Math.max(this._startCtrlPosition, 0);
        pos = Math.min(pos, this.width);

        this._snap(pos, data.velocity);
    };

    // Transition (default: snap) the range control to the tick nearest to pos, with velocity.
    Range.prototype._snap = function(pos, velocity) {
        if (!this.options.alwaysSnap || !this._tickIncrement) {
            return this.setPosition(pos);
        }

        // find the nearest tick position (mathematical rounding)
        var tick = this.getTick(pos);
        // this prevents _snap from going into effect many times in one frame
        if (tick === this._previousTick) { return; }
        this._previousTick = tick;
        pos = tick * this._tickIncrement;

        this.position.halt(); // remove previous snap
        var transition = this.options.transition;
        transition.velocity = transition.velocity || velocity;
        this.setPosition(pos, transition, function() {
            this.isSet = true;
        }.bind(this));
    };

    var _end = function _end(data) {
        this.control.removeClass(this.options.activeClass);
    };

    /**
     * Set proportional position of range control.
     * @method setPosition
     * @param {Number} [position] (greater than 0)
     * @param {Transition} [transition] Transition for Transitionable
     * @param {Function} [callback] Transition callback.
     */
    Range.prototype.setProportion = function setProportion(proportion, transition, callback) {
        this.bar.setProportion(proportion, transition, callback);
    };
    /**
     * Set absolute position of range control.
     * @method setProportion
     * @param {Number} [position] (greater than 0)
     * @param {Transition} [transition] Transition for Transitionable
     * @param {Function} [callback] Transition callback.
     */
    Range.prototype.setPosition = function setPosition(position, transition, callback) {
        this.bar.setPosition(position, transition, callback);
    };
    /**
     * Get absolute position of range control.
     * @method getPosition
     * @return {Number} position (greater than 0)
     */
    Range.prototype.getPosition = function getPosition() {
        return this.bar.getPosition();
    };
    /**
     * Get relative (proportion) position of range control.
     * @method getProportion
     * @return {Number} proportion (between 0 and 1)
     */
    Range.prototype.getProportion = function getProportion() {
        return this.bar.getProportion();
    };
    /**
     * Get nearest tick to range control.
     * @method getTick
     * @return {Number} tick (greater than 0)
     */
    Range.prototype.getTick = function getTick(pos) {
        pos = typeof pos === 'undefined' ? this.getPosition() : pos;
        return Math.round(pos / this._tickIncrement);
    };
    module.exports = Range;
});
