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

    /**
     * 
     *
     * @class Spinner
     * @constructor
     * @param {Object} [options] An object of configurable options.
     * @param {Number} [options.diameter=40] Diamenter of spinner.
     * @param {Number} [options.rotateIncrement=0.15] Amount of rotation during each tick (positive = clockwise).
     * @param {Number} [options.spokeCount=8] Number of spokes in spinner.
     * @param {Number} [options.spokeWidth=4] Width (thickness) of each spoke.
     * @param {Number} [options.gapRadius=8] Radius of the inner circular empty space.
     * @param {Array|String} [options.classes] CSS classes for each spoke. Default: ['spin-bar'] 
     *
     * @readOnly
     * @property {Modifier} [this.rotate] Modifier that determines rotation transformation. Use this to directly modify rotation, but only in special cases.
     */
    function Spinner() {
        View.apply(this, arguments);
        var opts = this.options;
        var TWO_PI = 2 * Math.PI;

        var z = 0;
        var increment = opts.rotateIncrement;
        this.rotate = new Modifier({
            size: [opts.diameter, opts.diameter],
            origin: [0.5, 0.5],
            transform: function() {
                z += increment;
                z = z % TWO_PI;
                return Transform.rotateZ(z);
            }
        });
        this._node = this.add(this.rotate);

        var position = this.add(new Modifier({
            origin: [0.5, 1],
            align: [0.5, 0.5]
        }));
        var rotateIncrement = TWO_PI / opts.spokeCount;
        for (var i = 1; i <= opts.spokeCount; i++) {
            var angle = i * rotateIncrement;
            var surfaceRotate = new Modifier({
                transform: Transform.moveThen([0, -opts.gapRadius, 0], Transform.rotateZ(angle))
            });
            var surface = new Surface({
                size: [opts.spokeWidth, opts.diameter / 2 - opts.gapRadius],
                classes: opts.classes
            });
            position.add(surfaceRotate).add(surface);
        }
    }

    Spinner.prototype = Object.create(View.prototype);
    Spinner.prototype.constructor = Spinner;
    Spinner.DEFAULT_OPTIONS = {
        diameter: 40,
        rotateIncrement: 0.15,
        spokeCount: 8,
        spokeWidth: 4,
        gapRadius: 8,
        classes: ['spin-bar']
    };
    /**
     * Get size
     * @method getSize
     * @return {Array|Number} size
     */
    Spinner.prototype.getSize = function getSize() {
        return [this.options.diameter, this.options.diameter];
    };
    module.exports = Spinner;
});
