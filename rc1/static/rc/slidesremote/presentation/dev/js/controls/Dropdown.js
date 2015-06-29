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
    var View = require('famous/core/View');
    var RenderNode = require('famous/core/RenderNode');
    var Lightbox = require('famous/views/Lightbox');
    var Easing = require('famous/transitions/Easing');

    /**
     * Dropdown control. The dropdown is composed of: a dropdown container (containing basic box-shadow), and a user-supplied renderable placed inside the container. Similar to Bootstrap's dropdown. Comes with default styles that can be overrided with other frameworks (e.g. Bootstrap). See controls.css.
     *
     * @class Dropdown
     * @constructor
     * @param {Object} [options] An object of configurable options. Any Lightbox options can also be passed to configure the Lightbox that is used to transition states.
     * @param {Array<Number>} [options.size] Dropdown container size Default: [200, 200]
     * @param {Array<Number>} [options.origin] Origin object specifying where to place the dropdown container relative to its parent. Default: [0,0]
     * @param {Renderable} [options.renderable] Renderable that will be added within the dropdown container.
     * @param {Transform} [options.baseTransform] Transform for the dropdown container.
     * @param {Transform} [options.renderableTransform] Tranform for the renderable, dictating how it is positioned within the dropdown container (use this for adding internal padding).
     * @param {Array<String>} [options.classes] CSS classes for the dropdown container.
     * @param {Options} [options.] Any Lightbox options.
     *
     * @readOnly
     * @property {Boolean} [this.isShown] Whether the dropdown is shown
     * @readOnly
     * @property {StateModifier} [this.modifier] StateModifier that defines attributes of entire dropdown.
     * @readOnly
     * @property {Renderable} [this.dropdown] Renderable to show inside container.
     * @readOnly
     * @property {RenderNode} [this.dropdownNode] RenderNode corresponding to dropdown container.
     * @readOnly
     * @property {Lightbox} [this.lightbox] Lightbox used to show/hide dropdown
     */
    function Dropdown(options) {
        View.apply(this, arguments);
        var opts = this.options;
        this.isShown = false;

        this.modifier = new StateModifier({
            size: opts.size,
            origin: opts.origin,
            transform: opts.baseTransform
        });

        var renderable = opts.renderable;
        var renderablePos = new StateModifier({
            transform: opts.renderableTransform
        });
        opts.renderable = undefined;

        this.dropdown = new Surface({
            classes: opts.classes
        });

        this.dropdownNode = new RenderNode(this.modifier);
        this.dropdownNode.add(this.dropdown);
        this.dropdownNode.add(renderablePos).add(renderable);

        this.lightbox = setupLightbox(opts, this);
    }
    // Lightbox api specific methods:
    // example: outTransform is replaced by inTransform, unless inTransform doesn't exist, or unless outTransform already exists.
    var replaceOutByIn = function(obj, prop) {
        var inProp = 'in' + prop;
        var outProp = 'out' + prop;
        if (obj[inProp] && !obj[outProp]) {
            obj[outProp] = obj[inProp];
        }
    };
    var setupLightbox = function(opts, node) {
        // by default, out property is set to in property
        replaceOutByIn(opts, 'Transform');
        replaceOutByIn(opts, 'Origin');
        replaceOutByIn(opts, 'Opacity');

        var lightbox = new Lightbox(opts);
        node.add(lightbox);
        return lightbox;
    };

    Dropdown.prototype = Object.create(View.prototype);
    Dropdown.prototype.constructor = Dropdown;
    var defaultTransition = {duration: 100, curve: Easing.outQuad};
    Dropdown.DEFAULT_OPTIONS = {
        size: [200, 200],
        origin: [0,0],
        baseTransform: Transform.translate(0,45, 1),        // box distance from top
        renderableTransform: Transform.translate(10,10,1),  // dots dist from box edges
        inTransition: defaultTransition,
        outTransition: defaultTransition,
        classes: ['dropdown'],
        inOpacity: 0,
        showOpacity: 1,
        outOpacity: 0,
        overlap: false
    };

    /**
     * Toggles the dropdown between show and hide states.
     * @method toggle
     * @param {Transition} [transition] Overwrites the default lightbox transition when toggling.
     * @param {function} [callback] Executes after toggling the dropdown.
     */
    Dropdown.prototype.toggle = function toggle(transition, callback) {
        if (this.isShown) {
            this.hide(transition, callback);
        }
        else {
            this.show(transition, callback);
        }
    };
    /**
     * Shows the dropdown.
     * @method show
     * @param {Transition} [transition] Overwrites the default transition.
     * @param {function} [callback] Executes after showing the dropdown.
     */
    Dropdown.prototype.show = function show(transition, callback) {
        if (this.isShown) { return; }
        this.isShown = true;
        this.lightbox.show(this.dropdownNode, transition, function() {
            this._eventOutput.emit('show');
            callback && callback();
        }.bind(this));
    };
    /**
     * Hides the dropdown.
     * @method hide
     * @param {Transition} [transition] Overwrites the default transition.
     * @param {function} [callback] Executes after hiding the dropdown.
     */
    Dropdown.prototype.hide = function hide(transition, callback) {
        this.isShown = false;
        this.lightbox.hide(transition, function() {
            this._eventOutput.emit('hide');
            callback && callback();
        }.bind(this));
    };
    module.exports = Dropdown;
});
