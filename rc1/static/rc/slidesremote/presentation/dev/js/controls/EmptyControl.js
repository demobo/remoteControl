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
    var Control = require('controls/Control');

    /**
     * 
     *
     * @class 
     * @constructor
     * @param {Object} [options] An object of configurable options.
     * @param {} [options.] 
     *
     * @readOnly
     * @property {} [this.] 
     */
    function EmptyControl() {
        Control.apply(this, arguments);
        var opts = this.options;

        var control = new Surface({
            size:[undefined, undefined],
            classes: opts.classes,
            content: opts.content
        });

        this.add();
    }

    EmptyControl.prototype = Object.create(Control.prototype);
    EmptyControl.prototype.constructor = EmptyControl;
    EmptyControl.DEFAULT_OPTIONS = {
        size: [],
        classes: [''],
        content: '',
    };
    /**
     * Get size
     * @method getSize
     * @return {Array|Number} size
     */
    EmptyControl.prototype.getSize = function getSize() {
        return this.options.size;
    };
    module.exports = EmptyControl;
});
