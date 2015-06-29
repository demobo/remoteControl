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
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var Control = require('controls/Control');

    /**
     * Button that responds to click and hover events. All standard input events are emitted by this object. Comes with default styles that can be overrided with other frameworks (e.g. Bootstrap). See controls.css.
     *
     * @class Button
     * @constructor
     * @param {Object} [options] An object of configurable options.
     * @param {Array<Number>} [options.size] Button size (width, height). Default: [100,40]
     * @param {Number} [options.lineHeight] Line height (for vertical centering). Default: 38
     * @param {Array<String>} [options.classes] Array of CSS classes for button. Default: ['btn']
     * @param {String} [options.content] HTML content of button (icons added here)
     *
     * @readOnly
     * @property {StateModifier} [this.modifier] Modifier used to transition button.
     * @readOnly
     * @property {Renderable} [this.surface] Button surface.
     */
    function Button() {
        Control.apply(this, arguments);
        var opts = this.options;

        this.modifier = new StateModifier({
            size:opts.size,
            opacity: 1
        });

        var button = this.surface = new Surface({
            classes: opts.classes,
            content: opts.content,
            properties: {
                lineHeight: opts.lineHeight + 'px',
                backgroundColor: 'white'
            }
        });
        button.pipe(this._eventOutput);

        this.add(this.modifier).add(button);
    }

    Button.prototype = Object.create(Control.prototype);
    Button.prototype.constructor = Button;
    Button.DEFAULT_OPTIONS = {
        size: [100, 40],
        lineHeight: 38,
        classes: ['fa-btn'],
        content: 'click'
    };
    module.exports = Button;
});
