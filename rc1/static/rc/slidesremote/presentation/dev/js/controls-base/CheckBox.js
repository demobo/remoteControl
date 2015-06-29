/*
 * @author Sebastian Miller-Hack
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var GenericSync = require('famous/inputs/GenericSync');
    var EventHandler = require('famous/core/EventHandler');

    GenericSync.register({
        'mouse': MouseSync,
        'touch': TouchSync
    });

    /**
     * A logic-handling base class for a checkbox that can be skinned
     *
     * @class CheckBox
     * @constructor
     * @param {String} [skinId] the selected skin
     * @param {Object} [options] custom options that override the DEFAULT_OPTIONS
     */
    function CheckBox(skinId, options) {
        //-------------------------------- modified
        this.defaultSetting = false;
        if(options.isSoundOn !== undefined) this.defaultSetting = options.isSoundOn;
        if(options.isAnimationOn !== undefined) this.defaultSetting = options.isAnimationOn;
        if(this.defaultSetting === 'on') this.defaultSetting = true;
        if(this.defaultSetting === 'off') this.defaultSetting = false;

        //-------------------------------- modified
        this.skin = new skins[skinId](options);
        this._checked = false;
        this._disabled = false;
        _setListeners.call(this);
        _addStandardProperties.call(this);
    }

    /**
     * Sets up the standard HTML DOM checkbox interface
     *
     * @private
     */
    function _addStandardProperties() {
        this.autofocus = false;
        //--------------------------- modified
        this.defaultChecked = this.defaultSetting;
        //----------------------------
        this.checked = this.defaultChecked;
        this.defaultValue = 'on';
        this.disabled = false;
        this.form = '';
        this.indeterminate = false;
        this.name = '';
        this.requried = false;
        this.type = 'checkbox';
        this.value = this.defaultValue;
    }

    /**
     * Returns whether the control is checked
     *
     * @method
     * @return {boolean}
     */
    function getChecked() {
        return this._checked;
    }

    /**
     * Sets the checked state of the control
     *
     * @method
     * @param {boolean} [val] the new state
     */
    function setChecked(val) {
        if (this.disabled) {
            return;
        }
        if (this.skin.getInAnimation()) {
            return;
        }
        this._checked = val;
        this._eventOutput.emit('toggle:checked', this._checked);
    }

    /**
     * Returns whether the control is disabled
     *
     * @method
     * @return {boolean}
     */
    function getDisabled() {
        return this._disabled;
    }

    /**
     * Sets whether the control is disabled
     *
     * @method
     * @param {boolean} [val] is disabled
     */
    function setDisabled(val) {
        this._disabled = val;
        this._eventOutput.emit('disabled', this._disabled);
    }

    CheckBox.prototype.__defineGetter__('checked', function() {
        return this._checked;
    });

    CheckBox.prototype.__defineSetter__('checked', function(val) {
        if (this.disabled) {
            return;
        }
        if (this.skin.getInAnimation()) {
            return;
        }
        this._checked = val;
        this._eventOutput.emit('toggle:checked', this._checked);
    });

    CheckBox.prototype.__defineGetter__('disabled', function() {
        return this._disabled;
    });

    CheckBox.prototype.__defineSetter__('disabled', function(val) {
        this._disabled = val;
        this._eventOutput.emit('disabled', this._disabled);
    });
    /*
	Object.defineProperty(this, 'checked', { get : function(){
		return this._checked;
	}});
	Object.defineProperty(this, 'checked', { set : function(val){
		if(this.disabled){return;}
		if(this.skin.getInAnimation()){return;}
		this._checked = val;
		this._eventOutput.emit('toggle', this._checked);
	}});
	*/

    /**
     * Adds on-click event listeners to the checkBox
     *
     * @private
     */
    function _setListeners() {
        this.sync = new GenericSync({
            'mouse': {},
            'touch': {}
        });

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.skin.pipe(this._eventInput);
        this._eventOutput.pipe(this.skin);

        this._eventInput.on('click', function() {
            if (this.checked == false){
                this._eventOutput.emit("on");
            } else {
                this._eventOutput.emit("off")
            };
            this.checked = !this.checked;
        }.bind(this));
    }

    /**
     * Transitions the cursor and updates the state variable
     * @method changeState
     */
    CheckBox.prototype.changeState = function() {
        this.checked = !this.checked;
    };

    var skins = {};

    /**
     * Registers a skin object and its id/name
     *
     * @method registerSkin
     * @param {String} [id] the identifier of the skin to be used in future control assignment
     * @param {Object} [skin] the skin object to be associated with the id
     */
    CheckBox.registerSkin = function(id, skin) {
        skins[id] = skin;
    };

    /**
     * Returns the skin's renderable
     *
     * @method render
     * @return a renderable
     */
    CheckBox.prototype.render = function() {
        return this.skin.render();
    };

    /**
     * Returns the width and height of the object.
     *
     * @method getSize
     * @return { array[number, number] } width, height
     */
    CheckBox.prototype.getSize = function getSize() {
        return this.skin.getSize();
    };

    module.exports = CheckBox;
});
