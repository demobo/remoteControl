/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @author Sebastian Miller-Hack
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
 define(function(require, exports, module) {
	var Engine = require('famous/core/Engine');
	var Modifier = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');
	var Surface = require('famous/core/Surface');
	var View = require('famous/core/View');
	var Easing = require('famous/transitions/Easing');
	var Transitionable = require('famous/transitions/Transitionable');
	var MouseSync = require("famous/inputs/MouseSync");
	var TouchSync = require("famous/inputs/TouchSync");
	var GenericSync = require("famous/inputs/GenericSync");
	var SkinData = require('controls/SkinData');

	Toggle.DEFAULT_OPTIONS = {
		radius: 15,     // the radius of the slider
		length: 90,    // the width of the entire switch
		state: true,    // the starting state of the switch (right is true).
		duration: 500,  // the duration of the transition
		color: "#fff",  // the color of the slider
		colorOn: "#9d4",// the color of the interior of the switch while on/true
		colorOff: "#e22",// the color of the interior of the switch while off/false
		curve: Easing.inOutQuint, // the animation curve
		skin: 'ios'
	};

	// create Toggle as a subclass of View
	Toggle.prototype = Object.create(View.prototype);
	Toggle.prototype.constructor = Toggle;

	/**
	 * Toggle is a famo.us implementation of a toggle switch with two positions.
	 * @class Toggle
	 * @constructor
	 */
	function Toggle(){
		View.apply(this, arguments);
		_initToggle.call(this);
		_setListeners.call(this);
		this.inAnimation = false;
	}


	/**
	 * Initializes the Toggle instance by creating and positioning
	 * visual elements.
	 * @method
	 */
	function _initToggle(){
		var diameter = this.options.radius*2;

		// create the surfaces
		this.slider = new Surface(
			SkinData[this.options.skin]['toggle']['slider']
		);

		this.bgOn = new Surface(
			SkinData[this.options.skin]['toggle']['bgOn']
		);

		this.bgOff = new Surface(
			SkinData[this.options.skin]['toggle']['bgOff']
		);
		this.stateTransitionable = new Transitionable(0);
		
		this.sliderModifier = new Modifier({
			transform: function() {
				var xTranslation = this.stateTransitionable.get()*41;
				return Transform.translate(xTranslation, 0, 0);
			}.bind(this)
		});

		this.bgOnModifier = new Modifier({
			opacity: function() {return this.stateTransitionable.get()}.bind(this)
		});
		this.bgOffModifier = new Modifier({
			opacity: function() {return 1 - this.stateTransitionable.get()}.bind(this)
		});

		// set the starting position
		if (this.options.state){
			this.stateTransitionable.set(1);
		}else{
			this.stateTransitionable.set(0);
		}


		this.add(this.bgOnModifier).add(this.bgOn);
		this.add(this.bgOffModifier).add(this.bgOff);
		this.add(this.sliderModifier).add(this.slider);
	}

	/**
	 * Adds on-click event listeners to both surfaces
	 * @method _setListeners
	 */
	function _setListeners(){
		this.bgOn.pipe(this);
		this.bgOff.pipe(this);
		this.slider.pipe(this);

		this._eventInput.on('click', function(){
			this.changeState();
		}.bind(this));

		// register any necessary Syncs globally
		GenericSync.register({
			"mouse"  : MouseSync,
			"touch"  : TouchSync,
		});

		this.sync = new GenericSync({
			"mouse"  : {},
			"touch"  : {},
		});

		// pipe surface events to `MouseSync` and `TouchSync`
		this.bgOn.pipe(this.sync);
		this.bgOff.pipe(this.sync);
		this.slider.pipe(this.sync);
 
		this.deltaPos = 0;
		
		this.sync.on('update', function(data){
			//find the distance traveled during the touch
			if (data.delta[0] == null){
				this.deltaPos = 0;
			}else{
				this.deltaPos = this.deltaPos + data.delta[0];
			}
			if (this.deltaPos > this.options.length/4){
				this.changeStateOn();
			}else if (this.deltaPos < -this.options.length/4){
				this.changeStateOff();
			}
		}.bind(this));
		
		this.sync.on('end', function(data){
			this.deltaPos = 0;
		}.bind(this));
	};


	Toggle.prototype.changeStateOn = function(){
		if (this.inAnimation) return; //return if we are already transitioning at the moment
		this.inAnimation = true;
		this.options.state = true;

		this.stateTransitionable.set(1, {duration:this.options.duration, curve: this.options.curve},
			function(){
				this.inAnimation = false;
			}.bind(this)
		);
	};

	Toggle.prototype.changeStateOff = function(){
		if (this.inAnimation) return; //return if we are already transitioning at the moment
		this.inAnimation = true;
		this.options.state = false;

		this.stateTransitionable.set(0, {duration:this.options.duration, curve: this.options.curve},
			function(){
				this.inAnimation = false;
			}.bind(this)
		);
	};

	/**
	 * Changes the position of the switch and updates the state variable
	 * @method changeState
	 * @param {number} id of the index of the radio that has been selected
	 * @param {boolean} inAnimation is used to prevent the activation of
	 * multiple transitions in queue.
	 * @param {boolean} state is the positon of the switch (right is true).
	 */
	Toggle.prototype.changeState = function(){
		if (this.options.state){
			this.changeStateOff();
		}else{
			this.changeStateOn();
		}
	};

	/**
	 * Returns the width and height of the object.
	 * @method getSize
	 * @return { [number, number] } width, height
	 */
	Toggle.prototype.getSize = function getSize() {
		return this.bgOff.size;
	}

	module.exports = Toggle;
});
