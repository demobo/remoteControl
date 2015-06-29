/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @author Sebastian Miller-Hack
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define(function(require, exports, module) {
	var View = require('famous/core/View');
	var Engine = require('famous/core/Engine');
	var Surface = require('famous/core/Surface');
	var Modifier = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');
	var Easing = require('famous/transitions/Easing');
	var StateModifier = require('famous/modifiers/StateModifier');
	var SkinData = require('controls/SkinData');


	/**
	 * CheckBox is a famo.us implementation of a typical html form checkbox.
	 * @class CheckBox
	 * @constructor
	 */
	function CheckBox(){
		View.apply(this, arguments);
		this._inAnimation = false;
		this._disabled = false;
		_addFamousObjects.call(this);
		_setListeners.call(this);
		_addStandardProperties.call(this);
	}

	// create CheckBox as a subclass of View
	//consider _.extend
	CheckBox.prototype = {
		set value(val){
			this.set(val);
		},
		get value(){
			return this.value;
		},
		set disabled(val){
			this._disabled = val;
			if(val){
				this.dot.setClasses([this.options.skin,'checkbox-dot','disabled']);
				this.background.setClasses([this.options.skin,'checkbox-background','disabled']);
			}else{
				this.dot.setClasses(SkinData[this.options.skin]['checkbox']['dot']['classes']);
				this.background.setClasses(SkinData[this.options.skin]['checkbox']['background']['classes']);
			}
		},
		get disabled(){
			return this._disabled;
		}
	};

	var temp = Object.create(View.prototype);
	for (key in temp) {
		CheckBox.prototype[key] = temp[key];
	}

	CheckBox.prototype.constructor = CheckBox;
	
	CheckBox.DEFAULT_OPTIONS = {
		skin: 'ios'
	};

	function _addFamousObjects(){
		this.dot = new Surface(
			SkinData[this.options.skin]['checkbox']['dot']
		);

		this.background = new Surface(
			SkinData[this.options.skin]['checkbox']['background']
		);

		this.stateModifier = new StateModifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
		});

		this.centerModifier = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5, 0.5],
		});


		this.add(this.stateModifier).add(this.dot);
		this.add(this.centerModifier).add(this.background);
	}

	function _addStandardProperties(){
		this.autofocus = false;
		this.defaltChecked = false;
		this.set(this.defaltChecked);
		this.defaultValue = "on";
		this.disabled = false;
		this.form = "";
		this.indeterminate = false;
		this.name = "";
		this.requried = false;
		this.type = "checkbox";
		this.value = this.defaultValue;
	}


	/**
	 * Adds on-click event listeners to the checkBox
	 * @method _setListeners
	 */
	function _setListeners(){
		this.dot.pipe(this);
		this.background.pipe(this);

		this._eventInput.on('click', function(){
			this.changeState();
		}.bind(this));
	}

	CheckBox.prototype.setTrue = function(){
		if(this.disabled){return;}
		if(this._inAnimation){return;}
		this._inAnimation = true;
		this.options.checked = true;
		this.stateModifier.setTransform(
			Transform.translate(0, 0, 2),
			{duration: 10, curve: Easing.outCubic},
			function(){this._inAnimation = false;}.bind(this)
		);
	}

	CheckBox.prototype.setFalse = function(){
		if(this.disabled){return;}
		if(this._inAnimation){return;}
		this._inAnimation = true;
		this.options.checked = false;
		this.stateModifier.setTransform(
			Transform.translate(0, 0, -2),
			{duration: 10, curve: Easing.outCubic},
			function(){this._inAnimation = false;}.bind(this)
		);
	}

	CheckBox.prototype.set = function(newState){
		if (newState){
			this.setTrue();
		}else{
			this.setFalse();
		}
	}

	/**
	 * Transitions the cursor and updates the state variable
	 * @method changeState
	 * @param {boolean} _inAnimation is used to prevent the activation of
	 * multiple transitions in queue.
	 * @param {boolean} state is the positon of the box.
	 */
	CheckBox.prototype.changeState = function(){
		this.set(!this.options.checked);
	}

	/**
	 * Returns the width and height of the object.
	 * @method getSize
	 * @return { [number, number] } width, height
	 */
	CheckBox.prototype.getSize = function getSize() {
		return this.background.size;
	}
	
	module.exports = CheckBox;
});
