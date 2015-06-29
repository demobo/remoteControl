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
	var CheckBox = require('controls/CheckBox');
	var SkinData = require('controls/SkinData');

	RadioButton.DEFAULT_OPTIONS = {
		state: 0,       // the starting position of the filled radio, zero indexed
		radius: 15,     // the radius of the radios
		duration: 500,  // the duration of the animation
		color: "#000",  // the color of the filled radio (dot)
		lineHeight: 50, // the distance between two lines
		bgColor: "#fff",// the color of unfilled radios
		curve: Easing.outBounce, // the animation curve
		width: 400,   // the width of the content
		content: [
			'Moscow',
			'Tokyo',
			'San Fransisco',
			'Seattle',
			'New York',
            'Los Angeles'
		],
		skin: 'ios'
	};


	// create RadioButton as a subclass of View
	RadioButton.prototype = Object.create(View.prototype);
	RadioButton.prototype.constructor = RadioButton;

	/**
	 * RadioButton is a famo.us implementation of a typical html form radio button.
	 * @class RadioButton
	 * @constructor
	 */
	function RadioButton(){
		View.apply(this, arguments);
		this.inAnimation = false;

		this.dot = new Surface(
			SkinData[this.options.skin]['checkbox']['dot']
		);

		//initialize arrays
		this.radios = [];
		this.radiosModifiers = [];

		// create a surface for each radio button and put it in the correct position
		for (var i = 0; i < this.options.content.length; i++){
			
			this.radios[i] = new Surface(
		        SkinData[this.options.skin]['checkbox']['background']
            );

			// set the position of each radio button
			this.radiosModifiers[i] = new StateModifier({
				transform: Transform.translate(
					this.options.radius,
					this.options.lineHeight/3 + this.options.lineHeight*i,
					0
					)
			});
			this.add(this.radiosModifiers[i]).add(this.radios[i]);
		}

		//set the starting position of the dot
		this.dotModifier = new StateModifier({
			transform: Transform.translate(
				this.options.radius,
				this.options.lineHeight/3 + this.options.lineHeight*this.options.state,
				0
				)
		});
		this.add(this.dotModifier).add(this.dot);
		_setListeners.call(this);
	}

	/**
	 * Adds on-click event listeners to each radio button
	 * @method _setListeners
	 * @param {number} i is the index of the radio buttons
	 */
	function _setListeners(){
		for (var i = 0; i < this.options.content.length; i++){
			this.radios[i].on('click', function(i) {
                this._eventOutput.emit('buttonClick', i);
                this.changeState(i);
			}.bind(this, i));
		}
	}

	/**
	 * Changes the position of the dot and updates the state variable
	 * @method changeState
	 * @param {number} id of the index of the radio that has been selected
	 * @param {boolean} inAnimation is used to prevent the activation of
	 * multiple transitions in queue.
	 * @param {boolean} state is the index of the selected radio button.
	 */
	RadioButton.prototype.changeState = function(id) {
        if (this.inAnimation === false) {
            this.inAnimation = true;
            this.options.state = id;

            this.dotModifier.setTransform(
                Transform.translate(
                    this.options.radius,
                    this.options.lineHeight / 3 + this.options.lineHeight * id,
                    0
                ),
                { duration: this.options.duration, curve: this.options.curve },
                function () {
                    this.inAnimation = false;
                }.bind(this)
            );
        }
    };

	/**
	 * Returns the width and height of the object.
	 * @method getSize
	 * @return { [number, number] } width, height
	 */
	RadioButton.prototype.getSize = function getSize() {
		return [this.options.width, this.options.content.length * this.options.lineHeight]
	};

	module.exports = RadioButton;
});
