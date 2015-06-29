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
    var Lightbox = require('famous/views/Lightbox');
    var OptionsManager = require('famous/core/OptionsManager');

    /**
     * TextInput corresponding to input[type='text']. All standard input[type='text'] events are emitted by this object. Comes with default styles that can be overrided with other frameworks (e.g. Bootstrap). See controls.css.
     *
     * @class TextInput
     * @constructor
     * @param {Object} [options] An object of configurable options.
     * @param {Boolean} [options.iconRight=false] Whether there is going to be an icon on the left side of the input.
     * @param {Boolean} [options.iconLeft=false] Whether there is going to be an icon on the right side of the input.
     * @param {Number} [options.iconPadding] Padding on left and right side of each icon. Default: 20
     * @param {Number} [options.size] TextInput size. Default: [300, 40]
     * @param {Array<String>} [options.classes] CSS classes for the text input. Default: ['rounded-input', 'text-input']
     * @param {String} [options.placeholder] TextInput input placeholder.
     * @param {String} [options.value] Value of text input.
     * @param {String} [options.name] Name of text input (for forms).
     *
     * @readOnly
     * @property {Array|Renderable} [this.currentIcons] Array of current renderables shown as icons. Format: [leftIcon, rightIcon]
     * @readOnly
     * @property {Array|Boolean} [this.transitioningIcons] Icons are transitioning. Format: [leftIcon, rightIcon]
     * @readOnly
     * @property {Array|Lightbox} [this.lightboxes] Array of lightboxes used to display and transition icons. Format: [leftLightbox, rightLightbox]
     */
    function TextInput() {
        View.apply(this, arguments);
        var opts = this.options;

        // all future surfaces added to this node (overrides view node):
        this._node = this.add(new StateModifier({
            size: opts.size
        }));

        var inputPadding = opts.iconPadding * 2 + 'px';
        var props = {};
        if (opts.iconRight) {
            props.paddingRight = inputPadding;
        }
        if (opts.iconLeft) {
            props.paddingLeft = inputPadding;
        }
        var control = new InputSurface({
            type: 'text',
            placeholder: opts.placeholder,
            value: opts.value,
            name: opts.name,
            classes: opts.classes,
            properties: props
        });
        control.pipe(this._eventOutput);

        this.add(control);
    }

    TextInput.prototype = Object.create(View.prototype);
    TextInput.prototype.constructor = TextInput;
    TextInput.DEFAULT_OPTIONS = {
        iconPadding: 20,
        size: [300, 40],
        classes: ['rounded-input', 'text-input'],
        placeholder: '',
        value: '',
        name: ''
    };

    /**
     * Set an icon to appear on the right side of the text input field. If called multiple times with transitions, only the first and last are shown to transition.
     *
     * @method setIcon
     * @param {Renderable} [icon] The renderable icon you want to show. Generally a surface.
     * @param {Boolean} [isRight=false] Whether icon is on right side of input. false = left side, true = right side.
     * @param {Object} [options] An object of configurable options. Any Lightbox options can also be passed to either initialize the Lightbox or override the options of the Lightbox that already exists (the override is not permanent).
     * @param {String} [options.event] Name of event to be triggered after icon is set.
     */
    TextInput.prototype.setIcon = function setIcon(icon, isRight, options) {
        var opts = this.options; // opts is the TextInput options
        _checkIconError(isRight, opts);
        options = options || {};
        var index = +isRight; // false = 0, true = 1

        this.transitioningIcons = this.transitioningIcons || [false, false];
        this._queuedIcons = this._queuedIcons || [null, null];
        this.currentIcons = this.currentIcons || [null, null];

        // If an icon is already being set (transition running), defer the call to this function to be run later
        if (this.transitioningIcons[index]) {
            // this overwrites previously queued function call so that only the latest call is run
            this._queuedIcons[index] = arguments;
            return;
        }
        this.transitioningIcons[index] = true;

        // override size that user might have set:
        icon.setSize([true, true]);
        this.currentIcons[index] = icon;

        this._configureLightbox(index, options, false);

        this.lightboxes[index].show(icon, options.inTransition, function() {
            this._eventOutput.emit('setIcon', options.event);
            // when done, get next transition from queue if it exists
            this.transitioningIcons[index] = false;
            var queuedArguments = this._queuedIcons[index];
            if (queuedArguments) {
                this._queuedIcons[index] = null;
                this.setIcon.apply(this, queuedArguments);
            }
        }.bind(this));
    };

    // throw error if user tries to set icon where there is no space
    var _checkIconError = function _checkIconError(isRight, opts) {
        if (!isRight && !opts.iconLeft) {
            throw new Error('TextInput error: trying to set icon on left side - invalid');
        }
        if (isRight && !opts.iconRight) {
            throw new Error('TextInput error: trying to set icon on right side - invalid');
        }
    };
    TextInput.prototype._configureLightbox = function _configureLightbox(index, options, override) {
        this.lightboxes = this.lightboxes || [];
        var lightbox = this.lightboxes[index];
        if (!lightbox) {
            this.lightboxes[index] = this._createLightbox(index, options);
        }
        else if (override) {
            lightbox.setOptions(options);
        }
    };
    TextInput.prototype._createLightbox = function _createLightbox(index, lightboxOpts) {
        var height = this.options.size[1];

        lightboxOpts = lightboxOpts || {};
        var inTransition = lightboxOpts.inTransition;
        var outTransition = lightboxOpts.outTransition || {duration: 0, curve: 'linear'};
        var inTransform = lightboxOpts.inTransform;
        var outTransform = lightboxOpts.outTransform;
        var showTransform = lightboxOpts.showTransform;

        var isRight = index;
        var sign = isRight ? -1 : 1;
        var iconPadding = this.options.iconPadding * sign;

        // set default transforms (move from edge of icon by iconPadding), vertically center with -2 adjustment
        showTransform = showTransform || Transform.translate(iconPadding, -2, 0);
        //if transition exists, set default transform to input's hieght / 2 above text innput
        var defaultInTransform = inTransition ? Transform.translate(iconPadding, -height/2,0) : showTransform;
        inTransform = inTransform || defaultInTransform;
        //default: move below text input by input's height / 2
        outTransform = outTransform || Transform.translate(iconPadding, height/2, 0);

        var origin = [index, 0.5]; // left or right, center
        var lightbox = new Lightbox({
            inTransform: inTransform,
            outTransform: outTransform,
            showTransform: showTransform,
            inOpacity: 0,
            outOpacity: 0,
            showOpacity: 1,
            inOrigin: origin,
            outOrigin: origin,
            showOrigin: origin,
            inTransition: inTransition,
            outTransition: outTransition,
            overlap: true
        });

        this.add(lightbox);
        return lightbox;
    };

    /**
     * Register a handler that will change the icon depending on the text input's text.
     *
     * @method setSwappableIconStates
     * @param {Function} [provider] A callback that is called every time the text input changes. Callback receives one parameter: the input text. The callback must return an object of the form: {left:<Renderable>, right:<Renderable> options:<Object>}. Generally the Renderable is a Surface. For the same text input state, the same (identity equality) renderable should be returned. Left/right correspond to the left and right sides of the input. The options that the callback returned are the same options accepted by setIcon.
     * 
     * @param {Object} [options] An object of configurable options. Any Lightbox options can also be passed to configure the Lightbox that is used to transition states.
     * @param {Array|Renderable} [options.defaultIcons] Array of default Renderables that the text input will show as the icon if there is no provider or the provider returns nothing. Format: [leftIcon, rightIcon]
     */
    TextInput.prototype.setSwappableIconStates = function setSwappableIconStates(provider, options) {
        options = options || {};

        if (this.options.iconLeft) {
            this._configureLightbox(0, options, true);
        }
        if (this.options.iconRight) {
            this._configureLightbox(1, options, true);
        }

        // set default icons:
        var defaults = options.defaultIcons;
        if (defaults) {
            options.inTransition = {duration: 0};
            if (defaults[0]) {
                this.setIcon(defaults[0], false, options);
            }
            if (defaults[1]) {
                this.setIcon(defaults[1], true, options);
            }
            options.defaultIcons = undefined;
        }

        if (!provider) {return;}

        this.on('input', function(e) {
            // format is {left:surface, right:surface, options:options}
            var iconRule = provider(e.target.value);
            if (!iconRule) { return; }

            var left = iconRule.left;
            var right = iconRule.right;
            // provider can return an options object that overrides defaults
            // if same icon, don't setIcon again
            if (left && this.currentIcons[0] !== left) {
                this.setIcon(left, false, iconRule.options);
            }
            if (right && this.currentIcons[1] !== right) {
                this.setIcon(right, true, iconRule.options);
            }
        }.bind(this));
    };
    module.exports = TextInput;
});
