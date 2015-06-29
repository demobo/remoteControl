/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: sebastian.the.eng@gmail
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
 define(function(require, exports, module) {
	var Engine = require('famous/core/Engine');
	var Modifier = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');
	var Surface = require('famous/core/Surface');
	var StateModifier = require('famous/modifiers/StateModifier');
	var View = require('famous/core/View');
	var Easing = require('famous/transitions/Easing');
	//var ContainerSurface= require('famous/surfaces/ContainerSurface');
	var Transitionable = require('famous/transitions/Transitionable');
	var MouseSync = require("famous/inputs/MouseSync");
	var TouchSync = require("famous/inputs/TouchSync");
	var GenericSync = require("famous/inputs/GenericSync");

	Knob.DEFAULT_OPTIONS = {
		diameter: 130,     // the radius of the slider
		width: 200,    // the width of the entire switch
		duration: 2000,  // the duration of the transition
		color: "#eee",  // the color of the slider
		bgColor: "#fff",// the color of the interior of the switch while on/true
		momentum:true,
		curve: Easing.outQuint // the animation curve
	};

	function Knob(){
		View.apply(this, arguments);
		_initKnob.call(this);
		this.angle = 0;
		this.inAnimation = false;
	}

	Knob.prototype = Object.create(View.prototype);
	Knob.prototype.constructor = Knob;


	function _initKnob(){
		this.spinner = new Surface({
			size: [this.options.diameter, this.options.diameter],
			origin: [0.5, 0.5],
			content: "<br><br><p align='right'>==></p>",
			properties: {
				border:"3px solid #ccc",
				background: this.options.color,
				borderRadius: "100px",
				zIndex: 1
			}
		});

		this.background = new Surface({
			size: [this.options.width, this.options.width],
			content:"knob",//content: "<br><center>50%</center><br><br><br>25% - - - - - - - - - =- - - - - 75%<br><br><br><center>&nbsp; &nbsp; 0% -|- 100%</center>",
			properties: {
				background: this.options.bgColor
			}
		});
		/*
		this.spinner.on('click', function(){
			var angle =  this.transitionable.get();
			//this.transitionable.set(angle + 1);
		}.bind(this));
		*/

		this.transitionable = new Transitionable(0);
	











		this.rotateModifier = new Modifier({
			origin: [0.5, 0.5],
			align: [0.5,0.5],
			transform: function() {
				var angle =  this.transitionable.get();
				return Transform.rotateZ(angle);
			}.bind(this)
		});

		this.centerStateModifier = new StateModifier({
			size: [200, 200]
		});

		this.add(this.background);
		this.add(this.centerStateModifier).add(this.rotateModifier).add(this.spinner);

		this.spinner.pipe(this);

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
		this.spinner.pipe(this.sync);
 
		this.deltaPos = 0;
		
		this.sync.on('start', function(data){
			var X = data.offsetX - this.options.diameter/2;
			var Y = data.offsetY - this.options.diameter/2;
			var angle = Math.atan(Y/X);
			if (X < 0 & Y > 0){
				angle = angle + Math.PI;
			}
			if (X < 0 & Y < 0){
				angle = angle - Math.PI;
			}
			this.start_angle = angle;
		}.bind(this));

		this.sync.on('update', function(data){
			var X = data.offsetX - this.options.diameter/2;
			var Y = data.offsetY - this.options.diameter/2;
			var distance = Math.sqrt(Math.pow(X,2) + Math.pow(Y,2));

			if(distance < (this.options.diameter/2 - 3)){
				
				var angle = Math.atan(Y/X);
				if (X < 0 & Y > 0){
					angle = angle + Math.PI;
				}
				if (X < 0 & Y < 0){
					angle = -Math.PI +  angle;
				}
				var delta_angle = angle - this.start_angle;
				var old_angle = this.transitionable.get();
				
				this.transitionable.set(delta_angle + old_angle);
			}
		}.bind(this));
		
		this.sync.on('end', function(data){
			if (this.options.momentum){
				var X = data.offsetX - this.options.diameter/2 + data.velocity[0];
				var Y = data.offsetY - this.options.diameter/2 + data.velocity[1];
				var mag = Math.sqrt(Math.pow(data.velocity[0],2) + Math.pow(data.velocity[1],2));
				//f(distance < (this.options.diameter/2 - 10)){
				
				var angle = Math.atan(Y/X);
				if (X < 0 & Y > 0){
					angle = angle + Math.PI;
				}
				if (X < 0 & Y < 0){
					angle = -Math.PI +  angle;
				}
				var delta_angle = angle - this.start_angle;
				var old_angle = this.transitionable.get();
				
				this.transitionable.set(delta_angle*1 + old_angle,{ duration : mag*this.options.duration, curve: this.options.curve });
			}
		}.bind(this));
	};










	/*
	Knob.prototype.changeState = function(){
		this.angle = this.angle + Math.PI/6;
		this.modifier.setTransform(
			Transform.rotateZ(this.angle),
			{ duration : 100, curve: Easing.outQuint }
		);
	}
	*/
	module.exports = Knob;
});
