define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Utility = require('famous/utilities/Utility');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var Scrollview = require('famous/views/Scrollview');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ViewSequence = require('famous/core/ViewSequence');
    var View = require('famous/core/View');
	var EventHandler = require('famous/core/EventHandler');
	
	var Easing = require('famous/transitions/Easing');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    var WallTransition = require("famous/transitions/WallTransition");
    var TweenTransition = require("famous/transitions/TweenTransition");
	var SnapTransition = require("famous/transitions/SnapTransition");
	var TransitionableTransform = require("famous/transitions/TransitionableTransform");

	
	var MouseSync     = require("famous/inputs/MouseSync");
	var TouchSync     = require("famous/inputs/TouchSync");
	var ScrollSync    = require("famous/inputs/ScrollSync");
	var GenericSync   = require("famous/inputs/GenericSync");
	
	var Lightbox      = require('famous/views/Lightbox');
	var RenderController = require("famous/views/RenderController");
	
	var SequentialLayout = require("famous/views/SequentialLayout");
    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
	var GridLayout = require("famous/views/GridLayout");
	var Deck           = require('famous/views/Deck');
	var Flipper    = require("famous/views/Flipper");
	var FlexibleLayout = require('famous/views/FlexibleLayout');
	var EdgeSwapper = require("famous/views/EdgeSwapper");

    var mainContext = Engine.createContext();

});
