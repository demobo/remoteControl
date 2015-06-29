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
    var RenderNode = require('famous/core/RenderNode');
    var View = require('famous/core/View');
    var Control = require('controls/Control');
    var Button = require('controls/Button');
    var TextInput = require('controls/TextInput');

    /**
     * 
     *
     * @class SegmentedControl
     * @constructor
     * @param {Object} [options] An object of configurable options.
     * @param {} [options.] 
     *
     * @readOnly
     * @property {} [this.controls] 
     */
    function SegmentedControl() {
        Control.apply(this, arguments);
        var opts = this.options;
        var count = opts.surfaces.length;
        var segmentWidth = opts.size[0] / count;
        var segmentHeight = opts.size[1];
        this.controls = [];

        this._node = this.add(new StateModifier({
            size: opts.size
        }));

        // format: ['button', 'text', <renderable>, ...]
        if (count <= 1) {
            throw new Error('SegmentedControl needs more than 1 surface');
        }

        // this ensures that the most recent clicked control is placed on top of all other controls
        // factory prevents closure reference to modifier from being overriden in loop
        var previousModifier;
        var focusHandlerFactory = function(modifier) {
            return function() {
                var translate;
                if (previousModifier) {
                    translate = Transform.getTranslate(previousModifier.getTransform());
                    previousModifier.setTransform(Transform.translate(translate[0], translate[1], 0));
                }
                translate = Transform.getTranslate(modifier.getTransform());
                modifier.setTransform(Transform.translate(translate[0], translate[1], 1e-3));
                previousModifier = modifier;
            };
        };

        var surfaces = opts.surfaces;
        for (var i = 0; i < count; i++) {
            var item = surfaces[i];
            var classes;
            var transform = Transform.translate(i * (segmentWidth - opts.borderWidth),0,0);
            if (i === 0 ) {
                transform = Transform.identity;
                classes = opts.segmentLeftClasses;
            }
            else if (i === count-1 ) {
                classes = opts.segmentRightClasses;
            }
            else {
                classes = opts.segmentClasses;
            }

            var origin = [0, 0.5];
            var control;
            var options = item.button || item.text;
            if (options) { options.size = undefined; }
            if (item.button) {
                options.classes = classes.concat(Button.DEFAULT_OPTIONS.classes);
                control = new Button(options);
            }
            else if (item.text) {
                options.classes = classes.concat(TextInput.DEFAULT_OPTIONS.classes);
                control = new TextInput(options);
            }
            else if (item instanceof View) {
                classes = classes.concat(opts.segmentBorderClasses);
                control = new View();
                control.add(new Surface({
                    classes: classes
                }));
                control.add(new StateModifier({
                    origin: [0.5, 0.5],
                    transform: Transform.inFront
                })).add(item);
                // pipe focus event
                item.pipe(control._eventOutput);
            }
            var mod = new StateModifier({
                size: [segmentWidth, segmentHeight],
                origin: origin,
                transform: transform
            });
            control.on('focus', focusHandlerFactory(mod));
            this.add(mod).add(control);
            control.pipe(this._eventOutput);
            this.controls.push(control);
        }
    }

    SegmentedControl.prototype = Object.create(Control.prototype);
    SegmentedControl.prototype.constructor = SegmentedControl;
    SegmentedControl.DEFAULT_OPTIONS = {
        surfaces: [],
        borderWidth: 2,
        segmentLeftClasses: ['segment-left'],
        segmentRightClasses: ['segment-right'],
        segmentClasses: ['segment'],
        segmentBorderClasses: ['segment-border'],
        size: [300, 40],
        segmentWidth: 150
    };

    module.exports = SegmentedControl;
});
