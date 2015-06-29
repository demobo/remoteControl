/*
 * @author Sebastian Miller-Hack
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var EventHandler = require('famous/core/EventHandler');

    /**
     * A logic-handling base class for a Range that can be skinned
     *
     * @class Range
     * @constructor
     * @param {String} [skinId] the selected skin
     * @param {Object} [options] custom options that override the DEFAULT_OPTIONS
     */
    function Range(skinId, options) {
        this.skin = new skins[skinId](options);
        this._checked = false;
        this._disabled = false;
        this._setListeners.call(this);
        this._addStandardProperties.call(this);
    }

    /**
     * Sets up the standard HTML DOM Range interface
     *
     * @private
     */
    Range.prototype._addStandardProperties = function() {
        this.autocomplete = false;
        this.autofocus = false;
        this.defaultValue = 50;
        this._value = this.defaultValue;
        this.disabled = false;
        this.form = '';
        this.list = null;
        this.max = 100;
        this.min = 0;
        this.step = 10;
        this.name = '';
        this.type = 'Range';
    }

    /**
     * Returns the value
     *
     * @method
     * @return {boolean}
     */
    Range.prototype.getValue = function() {
        return this._value;
    }

    /**
     * Sets the value of the control
     *
     * @method
     * @param {boolean} [val] the new state
     */
    Range.prototype.setValue = function(val) {
        if (this.disabled) {
            return;
        }
        this._value = Math.min(Math.max(val, this.min), this.max);
        var percent = (this._value - this.min) / (this.max - this.min);
        this._eventOutput.emit('change:position', percent);
    }

    /**
     * Returns whether the control is disabled
     *
     * @method
     * @return {boolean}
     */
    Range.prototype.getDisabled = function() {
        return this._disabled;
    }

    /**
     * Sets whether the control is disabled
     *
     * @method
     * @param {boolean} [val] is disabled
     */
    Range.prototype.setDisabled = function(val) {
        this._disabled = val;
        this._eventOutput.emit('disabled', this._disabled);
    }

    /**
     * Adds on-click event listeners to the Range
     *
     * @private
     */
    Range.prototype._setListeners = function() {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.skin.pipe(this._eventInput);
        this._eventOutput.pipe(this.skin);

        this._eventInput.on('dragged', function(deltaPixels) {
            var newValue = this._value + (this.max - this.min) * deltaPixels / this.skin.bar.size[0];
            this.setValue(newValue);
        }.bind(this));
    }

    var skins = {};

    /**
     * Registers a skin object and its id/name
     *
     * @method registerSkin
     * @param {String} [id] the identifier of the skin to be used in future control assignment
     * @param {Object} [skin] the skin object to be associated with the id
     */
    Range.registerSkin = function(id, skin) {
        skins[id] = skin;
    };

    /**
     * Returns the skin's renderable
     *
     * @method render
     * @return a renderable
     */
    Range.prototype.render = function() {
        return this.skin.render();
    };

    /**
     * Returns the width and height of the object.
     *
     * @method getSize
     * @return { array[number, number] } width, height
     */
    Range.prototype.getSize = function getSize() {
        return this.skin.getSize();
    };

    module.exports = Range;
});
