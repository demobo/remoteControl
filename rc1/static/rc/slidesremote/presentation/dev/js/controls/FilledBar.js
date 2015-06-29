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
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var Transitionable = require('famous/transitions/Transitionable');

    /**
     * FilledBar is a bar with a set, transitionable fill. Comes with default styles that can be overrided with other frameworks (e.g. Bootstrap). See controls.css.
     *
     * @class FilledBar
     * @constructor
     * @param {Object} [options] An object of configurable options.
     * @param {Array<Number>} [options.size] Size of bar. Default: [200, 24]
     * @param {Boolean} [options.clip] Whether the bar fill is clipped by the bar outline (clip: true means the fill does not overflow). Default: true.
     * @param {Boolean} [options.isVisibleAtZero] Whether the bar fill is visible when getPosition() == 0. Default: false.
     * @param {Array|String} [options.outlineClasses] CSS classes for the bar outline. Default: ['bar-fill-outline']
     * @param {Array|String} [options.fillClasses] CSS classes for the bar fill. Default: ['bar-fill', 'bar-fill-left']
     *
     * @readOnly
     * @property {RenderNode} [this.fillPositionNode] Render node that bar fill is positioned/sized against (use this to append labels or other surfaces).
     * @property {Transitionable} [this.position] Transitionable for position of bar fill relative to starting point.
     */
    function FilledBar() {
        View.apply(this, arguments);
        var opts = this.options;
        var height = opts.size[1];

        var size = new StateModifier({
            size: opts.size
        });
        this._node = this.add(size); // overrides this._node

        // use a ContainerSurface if user needs clipping, otherwise don't
        var barOutline;
        if (opts.clip) {
            barOutline = new ContainerSurface({
                classes: opts.outlineClasses,
                properties: {
                    overflow: 'hidden'
                }
            });
        }
        else {
            barOutline = new Surface({
                classes: opts.outlineClasses,
            });
        }
        this.add(barOutline);
        barOutline.pipe(this._eventOutput);

        this.position = new Transitionable(0);
        var barFill = new Surface({
            classes: opts.fillClasses
        });

        var fillModifier = new Modifier({
            origin: [0, 0.5],
            transform: Transform.behind,
            size: function() {
                return [this.getPosition(), height];
            }.bind(this)
        });
        // add fill to ContainerSurface if using it:
        var fillParent = opts.clip ? barOutline : this;
        this.fillPositionNode = fillParent.add(fillModifier);

        var fillNode = this.fillPositionNode;
        // Fixes bug where if position = 0, the bar still has a partial (tiny) fill.
        // If position = 0, set opacity to 0
        if (!opts.isVisibleAtZero) {
            fillNode = this.fillPositionNode.add(new Modifier({
                    opacity: function() {
                    return this.position.get() === 0 ? 0 : 1;
                }.bind(this)
            }));
        }

        fillNode.add(barFill);
    }

    FilledBar.prototype = Object.create(View.prototype);
    FilledBar.prototype.constructor = FilledBar;
    FilledBar.DEFAULT_OPTIONS = {
        size: [200, 24],
        clip: true,
        isVisibleAtZero: false,
        outlineClasses: ['bar-fill-outline'],
        fillClasses: ['bar-fill', 'bar-fill-left'],
    };

    /**
     * Set absolute position of bar fill.
     * @method setPosition
     * @param {Number} [position] (greater than 0)
     * @param {Transition} [transition] Transition for Transitionable
     * @param {Function} [callback] Transition callback.
     */
    FilledBar.prototype.setPosition = function setPosition(position, transition, callback) {
        this.position.set(position, transition, function() {
            this._eventOutput.emit('set', position);
            callback && callback();
        }.bind(this));
    };
    /**
     * Set proportional position of bar fill.
     * @method setProportion
     * @param {Number} [position] (greater than 0)
     * @param {Transition} [transition] Transition for Transitionable
     * @param {Function} [callback] Transition callback.
     */
    FilledBar.prototype.setProportion = function setProportion(proportion, transition, callback) {
        var width = this.options.size[0];
        this.setPosition(proportion * width, transition, callback);
    };
    /**
     * Get absolute position of bar fill.
     * @method getPosition
     * @return {Number} position (greater than 0)
     */
    FilledBar.prototype.getPosition = function getPosition() {
        return this.position.get();
    };
    /**
     * Get relative (proportion) position of bar fill.
     * @method getProportion
     * @return {Number} proportion (between 0 and 1)
     */
    FilledBar.prototype.getProportion = function getProportion() {
        var width = this.options.size[0];
        return this.getPosition() / width;
    };
    module.exports = FilledBar;
});
