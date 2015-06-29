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
    var InputSurface = require('famous/surfaces/InputSurface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');

    var SegmentedTextField = function() {
        View.apply(this, arguments);
        var opts = this.options;

        var properties = {
            color: opts.color,
            backgroundColor: opts.backgroundColor, //override point
            border: opts.borderColor, //override point
            borderRadius: opts.borderRadius, //override point
        };
        var parent = new Surface({
            size:[opts.width, opts.height],
            classes: opts.parentClasses,
            properties: properties
        });
        var node = this.add(parent);

        properties = {
            backgroundColor: opts.backgroundColor, //override point
            borderRadiusBottomRight: opts.borderRadius,
            borderRadiusTopRight: opts.borderRadius
        };
        var input = new InputSurface({
            type: 'text',
            placeholder: opts.placeholder,
            value: opts.value,
            size:[opts.width - opts.segmentWidth, opts.height - opts.borderSize],
            classes: opts.inputClasses,
            properties: properties
        });
        input.pipe(this._eventOutput);

        this.segment = new Surface({
            size:[opts.segmentWidth, opts.height - opts.borderSize],
            properties: {
                backgroundColor: 'black'
            }
        });

        var segmentOrigin, inputTransform;
        if (opts.segment === 'left') {
            segmentOrigin = [0,0.5];
            inputTransform = Transform.translate(opts.segmentWidth, 0, 0);
        }
        else {
            segmentOrigin = [1,0.5];
            inputTransform = Transform.identity;
        }
        var segmentAlign = new StateModifier({
            origin: segmentOrigin
        });
        var inputAlign = new StateModifier({
            transform: inputTransform
        });

        node.add(segmentAlign).add(this.segment);
        node.add(inputAlign).add(input);
    };

    SegmentedTextField.prototype = Object.create(View.prototype);
    SegmentedTextField.prototype.constructor = SegmentedTextField;
    SegmentedTextField.DEFAULT_OPTIONS = {
        segment: 'left',
        borderRadius: '8px',
        borderSize: 8,
        width: 300,
        height: 40,
        segmentWidth: 60,
        placeholder: '',
        parentClasses: ['rounded-input'],
        inputClasses: ['text-field'],
        value: ''
    };
    module.exports = SegmentedTextField;
});
