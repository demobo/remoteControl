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
    var Utility = require('famous/utilities/Utility');
    var Transitionable = require('famous/transitions/Transitionable');
    var WallTransition = require("famous/transitions/WallTransition");

    /**
     * Radial fan-out menu. Consists of a menu button and several submenu buttons that are fanned out. Comes with default styles that can be overriden. See controls.css.
     *
     * @class RadialMenu
     * @constructor
     * @param {Object} [options] An object of configurable options.
     * @param {Renderable} [options.button=undefined] Renderable to use as the main menu button. By default one is generated.
     * @param {String} [options.content='x'] Content inside main menu button. Default is a x that is rotated to initially appear as a '+'. 
     * @param {Array|String} [options.buttonContentClasses] CSS classes for menu button content. Unused if own button renderable is provided. Default: ['radial-btn-content']
     * @param {Array|String} [options.buttonClasses] CSS classes for menu button. Unused if own button renderable is provided. Default: ['radial-btn']
     * @param {Number} [options.buttonRadius=20] Radius of menu button. Unused if own button renderable is provided.
     * 
     * @param {Transition} [options.buttonHide] Button transition when hiding menu elements. Default: WallTransition with period of 400 and dampingRatio of 0.6.
     * @param {Transform} [options.buttonHideTransform] Button end state transform after hiding menu elements. Also the initial transform state. Default: z rotation of pi/4 (45 degrees).
     * @param {Transition} [options.buttonShow] Button transition when showing menu elements. Default: WallTransition with period of 300 and dampingRatio of 0.6.
     * @param {Transform} [options.buttonShowTransform] Button end state transform after showing menu elements. Default: z rotation of pi/2 (90 degrees).
     * 
     * @param {Number} [options.startAngle=0] Start angle of submenu button fanout arrangement. In radians. 0 = 3 o'clock, the positive direction is counterclockwise.
     * @param {Number} [options.endAngle=pi/2] End angle of submenu button fanout arrangement. See options.startAngle for units.
     * @param {Number} [options.radius=140] Distance from center of button to center of each menu button.
     * 
     * @param {Transition} [options.hide] Transition for hiding submenu buttons. Default: options.buttonHide
     * @param {Transition} [options.show] Transition for showing submenu buttons. Default: options.buttonShow
     * @param {Array|Number} [options.startPosition] Array determining the start position of submenu buttons. Format is [x,y,z,z rotation]. Default: [0,0,-1e-3,0] (behind menu button)
     * @param {Number} [options.endZ=1e-3] Ending z-position of submenu buttons.
     * @param {Number} [options.endRotation=8pi] Radians of rotation for submenu buttons during show transform (during fanout). Positive = clockwise.
     *
     * @readOnly
     * @property {Boolean} [this.isShown] Whether the radial menu is shown. Note: being in the middle of the show transition counts as being shown.
     * @readOnly
     * @property {StateModifier} [this.buttonModifier] StateModifier for menu button.
     * @property {Array|Modifier} [this.modifiers] Modifiers corresponding to submenu buttons. Order of modifiers corresponds to order of submenu buttons (counterclockwise direction).
     */
    function RadialMenu() {
        Transitionable.registerMethod('wall', WallTransition);
        View.apply(this, arguments);
        var opts = this.options;
        this.isShown = false;
        this.modifiers = [];
        this._showTransforms = [];
        this._transitionables = [];

        var diameter = opts.buttonRadius * 2;
        var sizing = new StateModifier({
            size:[diameter, diameter]
        });
        this._node = this.add(sizing);
        var centering = new StateModifier({
            origin:[0.5, 0.5]
        });
        this._center = this.add(centering);

        this.buttonModifier = new StateModifier({
            transform: opts.buttonHideTransform
        });
        var modified = this._center.add(this.buttonModifier);
        var button = opts.button || new Surface({
            classes: opts.buttonClasses
        });

        // default button content:
        if (!opts.button) {
            var buttonContent = new Surface({
                content: opts.content,
                classes: opts.buttonContentClasses,
                size: [true, true]
            });
            buttonContent.pipe(this._eventOutput);
            modified.add(buttonContent);
        }
        modified.add(button);

        button.pipe(this._eventOutput);
        this._eventOutput.on('click', function() {
            this.toggle();
        }.bind(this));
    }

    RadialMenu.prototype = Object.create(View.prototype);
    RadialMenu.prototype.constructor = RadialMenu;
    var show = {
        method : 'wall',
        period : 300,
        dampingRatio: 0.6
    };
    var hide = {
        method : 'wall',
        period : 400,
        dampingRatio: 0.6
    };
    RadialMenu.DEFAULT_OPTIONS = {
        button: undefined,
        content: '✖',
        buttonContentClasses: ['radial-btn-content'],
        buttonClasses: ['radial-btn'],
        buttonRadius: 20,
        buttonHide: hide,
        buttonHideTransform: Transform.rotateZ(Math.PI / 4),
        buttonShow: show,
        buttonShowTransform: Transform.rotateZ(Math.PI / 2),
        startAngle: 0,
        endAngle: Math.PI/2,
        radius: 140,
        hide: hide,
        show: show,
        startPosition: [0, 0, -1e-3, 0],
        endZ: 1e-3,
        endRotation: Math.PI*8
    };

    /**
     * Toggles the menu between show/hide.
     * @method toggle
     * @param {Function} [callback] Executes after toggle.
     */
    RadialMenu.prototype.toggle = function toggle(callback) {
        if (this.isShown) {
            this.hide(callback);
        }
        else {
            this.show(callback);
        }
    };

    RadialMenu.prototype._toggleMenuItems = function _toggleMenuItems(show, callback) {
        var opts = this.options;
        for (var i = 0; i < this.modifiers.length; i++ ) {
            var modifier = this.modifiers[i];
            var transitionable = this._transitionables[i];
            var showTransform = this._showTransforms[i];
            callback = Utility.after(this.modifiers.length, callback);
            transitionable.halt();
            if (show) {
                transitionable.set(showTransform, opts.show, callback);
            }
            else {
                transitionable.set(opts.startPosition, opts.hide, callback);
            }
        }
    };

    /**
     * Shows radial menu.
     * @method show
     * @param {Function} [callback] Executes after showing.
     */
    RadialMenu.prototype.show = function show(callback) {
        var opts = this.options;
        callback = function () {
            this._eventOutput.emit('show');
            callback && callback();
        }.bind(this);
        callback = Utility.after(2, callback);

        this._toggleMenuItems(true, callback);
        this.buttonModifier.halt();
        this.buttonModifier.setTransform(opts.buttonShowTransform, opts.buttonShow, callback);
        this.isShown = true;
        
    };
    /**
     * Hides radial menu.
     * @method hide
     * @param {Function} [callback] Executes after hiding.
     */
    RadialMenu.prototype.hide = function hide(callback) {
        var opts = this.options;
        callback = function () {
            this._eventOutput.emit('hide');
            callback && callback();
        }.bind(this);
        callback = Utility.after(2, callback);

        this._toggleMenuItems(false, callback);
        this.buttonModifier.halt();
        this.buttonModifier.setTransform(opts.buttonHideTransform, opts.buttonHide, callback);
        this.isShown = false;
    };

    // prevents transitionable closure from being overwritten in loop
    var functionFactory = function(transitionable) {
        return function() {
            var pos = transitionable.get();
            return Transform.thenMove(Transform.rotateZ(pos[3]), [pos[0], pos[1], pos[2]]);
        };
    };
    /**
     * Hides radial menu.
     * @method sequenceFrom
     * @param {Array|Renderables} [items] Array of renderables to show as submenu items.
     */
    RadialMenu.prototype.sequenceFrom = function sequenceFrom (items) {
        var opts = this.options;
        this.modifiers = [];
        this._showTransforms = [];

        var angleIncrement = (opts.endAngle - opts.startAngle) / items.length;
        var angle = opts.startAngle;
        for (var i = 0; i < items.length; i++) {
            var renderable = items[i];
            var transitionable = new Transitionable(opts.startPosition);
            var modifier = new Modifier({
                origin: [0.5, 0.5],
                transform: functionFactory(transitionable)
            });
            this.modifiers.push(modifier);
            this._transitionables.push(transitionable);
            this._center.add(modifier).add(renderable);

            var x = opts.radius * Math.cos(angle);
            var y = -opts.radius * Math.sin(angle);
            var z = opts.endZ;
            var showTransform = [x, y, z, opts.endRotation];
            this._showTransforms.push(showTransform);

            angle += angleIncrement;
        }
    };

    /**
     * Get total bounding box size of menu, when expanded.
     * The menu will actually take up less space because it's a circle and because this calculation assumes that the buttons sweep the entire circle, which is not usually the case.
     * NOTE: getSize only calculates the size from the center points of the radial sub menu buttons.
     * @method getSize
     * @return {Array|Number} size
     */
    RadialMenu.prototype.getSize = function getSize() {
        var diameter = this.options.radius * 2;
        return [diameter, diameter];
    };
    module.exports = RadialMenu;
});
