define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var Scrollview = require('famous/views/Scrollview');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ViewSequence = require('famous/core/ViewSequence');
    var Easing = require('famous/transitions/Easing');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    var View = require('famous/core/View');
    var SequentialLayout = require("famous/views/SequentialLayout");
    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
	var GridLayout = require("famous/views/GridLayout");
	var EventHandler = require('famous/core/EventHandler');
	
	var MouseSync     = require("famous/inputs/MouseSync");
	var TouchSync     = require("famous/inputs/TouchSync");
	var ScrollSync    = require("famous/inputs/ScrollSync");
	var GenericSync   = require("famous/inputs/GenericSync");
	var SnapTransition = require("famous/transitions/SnapTransition");

    var mainContext = Engine.createContext();

});
