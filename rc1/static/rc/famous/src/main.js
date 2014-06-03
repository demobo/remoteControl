
define("helpers/RenderHelpers", ["require", "exports", "module"], function(e, t, i) {
    function o(e) {
        e._object = null, e._child = null, e._hasCached = !1, e._hasMultipleChildren = !1, e._resultCache = {}, e._prevResults = {}, e._childResult = null
    }
    i.exports = {resetNode: o}
});

define("widgets/DeviceView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/core/RenderNode", "famous/surfaces/ContainerSurface"], function(e, t, i) {
    function o() {
        l.apply(this, arguments), s.call(this), n.call(this), r.call(this), a.call(this)
    }
    function s() {
        this.options.width ? this.options.height = this.options[this.options.type].aspectRatio * this.options.width : this.options.height && (this.options.width = this.options.height / this.options[this.options.type].aspectRatio), this.options.screenWidth = this.options[this.options.type].screenWidth * this.options.width, this.options.screenHeight = this.options[this.options.type].screenHeight * this.options.height, this.options.originX = this.options[this.options.type].originX * this.options.width, this.options.originY = this.options[this.options.type].originY * this.options.height
    }
    function n() {
        this.device = new u({size: [this.options.width, this.options.height],content: '<img src="' + this.options[this.options.type].image + '" width="' + this.options.width + '">'}), this.device.pipe(this._eventOutput), this._add(this.device)
    }
    function r() {
        this.container = new h({size: [this.options.screenWidth, this.options.screenHeight],properties: {backgroundColor: "black",overflow: "hidden"}}), this.containerMod = new c({transform: p.translate(this.options.originX, this.options.originY, .1)}), this._add(this.containerMod).add(this.container)
    }
    function a() {
        this.container.getSize();
        this.contentMod = new c({origin: [.5, .5]}), this.reset = new c({origin: [0, 0]}), this.contentNode = this.container.add(this.contentMod).add(this.reset)
    }
    var u = e("famous/core/Surface"), c = e("famous/core/Modifier"), p = e("famous/core/Transform"), l = e("famous/core/View"), h = (e("famous/core/RenderNode"), e("famous/surfaces/ContainerSurface"));
    o.prototype = Object.create(l.prototype), o.prototype.constructor = o, o.DEFAULT_OPTIONS = {type: "",width: 0,height: 0,iphone: {image: "/images/device-iphone.svg",aspectRatio: 659 / 317,screenWidth: .86,screenHeight: .705,originX: .07,originY: .148},ipad: {image: "/images/device-ipad.svg",aspectRatio: 434 / 290,screenWidth: .89,screenHeight: .8,originX: .058,originY: .096},nexus: {image: "/images/device-nexus.svg",aspectRatio: 667 / 332,screenWidth: .895,screenHeight: .789,originX: .05,originY: .0915}}, o.prototype.setLandscape = function() {
        this.contentMod.setTransform(p.rotateZ(-Math.PI / 2), this.options.rotateTransition), this.contentMod.setSize([this.container.getSize()[1], this.container.getSize()[0]])
    }, o.prototype.setPortrait = function() {
        this.contentMod.setTransform(p.rotateZ(0), this.options.rotateTransition), this.contentMod.setSize(this.container.getSize())
    }, o.prototype.getSize = function() {
        return [this.options.width, this.options.height]
    }, o.prototype.getScreenSize = function() {
        return [this.options.screenWidth, this.options.screenHeight]
    }, o.prototype.add = function(e) {
        return this.contentNode.add(e)
    }, i.exports = o
});

define("widgets/IframeSurface", ["require", "exports", "module", "famous/core/Surface"], function(e, t, i) {
    function o() {
        this._iframeUrl = "about:blank", s.apply(this, arguments)
    }
    var s = e("famous/core/Surface");
    o.prototype = Object.create(s.prototype), o.prototype.constructor = o, o.prototype.elementType = "iframe", o.prototype.elementClass = "famous-surface", o.prototype.setContent = function(e) {
        this._iframeUrl = e, this._contentDirty = !0
    }, o.prototype.deploy = function(e) {
        e.src = this._iframeUrl || "about:blank"
    }, o.prototype.recall = function(e) {
        e.src = ""
    }, i.exports = o
});

define(function(require, exports, module) {
	// import dependencies line 1390 in university.js
	Context = require("famous/core/Context"), ElementAllocator = require("famous/core/ElementAllocator"), 
	Entity = require("famous/core/Entity"), 
	EventArbiter = require("famous/events/EventArbiter"), EventFilter = require("famous/events/EventFilter"), 
	EventMapper = require("famous/events/EventMapper"), EventHandler = require("famous/core/EventHandler"), 
	Group = require("famous/core/Group"), Modifier = require("famous/core/Modifier"), 
	OptionsManager = require("famous/core/OptionsManager"), RenderNode = require("famous/core/RenderNode"), 
	Scene = require("famous/core/Scene"), SpecParser = require("famous/core/SpecParser"), Surface = require("famous/core/Surface"), 
	Transform = require("famous/core/Transform"), View = require("famous/core/View"), ViewSequence = require("famous/core/ViewSequence"), 
	Quaternion = require("famous/math/Quaternion"), Matrix = require("famous/math/Matrix"), Random = require("famous/math/Random"), 
	Vector = require("famous/math/Vector"), StateModifier = require("famous/modifiers/StateModifier"), 
	Draggable = require("famous/modifiers/Draggable"), ModifierChain = require("famous/modifiers/ModifierChain"), 
	PhysicsEngine = require("famous/physics/PhysicsEngine"), Body = require("famous/physics/bodies/Body"), 
	Circle = require("famous/physics/bodies/Circle"), Particle = require("famous/physics/bodies/Particle"), 
	Rectangle = require("famous/physics/bodies/Rectangle"), Collision = require("famous/physics/constraints/Collision"), 
	Constraint = require("famous/physics/constraints/Constraint"), Curve = require("famous/physics/constraints/Curve"), 
	Distance = require("famous/physics/constraints/Distance"), Wall = require("famous/physics/constraints/Wall"), 
	Walls = require("famous/physics/constraints/Walls"), Drag = require("famous/physics/forces/Drag"), 
	Force = require("famous/physics/forces/Force"), Repulsion = require("famous/physics/forces/Repulsion"), 
	Spring = require("famous/physics/forces/Spring"), RotationalSpring = require("famous/physics/forces/RotationalSpring"), 
	VectorField = require("famous/physics/forces/VectorField"), SymplecticEuler = require("famous/physics/integrators/SymplecticEuler"), 
	CanvasSurface = require("famous/surfaces/CanvasSurface"), InputSurface = require("famous/surfaces/InputSurface"), 
	ContainerSurface = require("famous/surfaces/ContainerSurface"), ImageSurface = require("famous/surfaces/ImageSurface"), 
	VideoSurface = require("famous/surfaces/VideoSurface"), FastClick = require("famous/inputs/FastClick"), 
	GenericSync = require("famous/inputs/GenericSync"), MouseSync = require("famous/inputs/MouseSync"), 
	PinchSync = require("famous/inputs/PinchSync"), RotateSync = require("famous/inputs/RotateSync"), 
	ScaleSync = require("famous/inputs/ScaleSync"), ScrollSync = require("famous/inputs/ScrollSync"), 
	TouchSync = require("famous/inputs/TouchSync"), TouchTracker = require("famous/inputs/TouchTracker"), 
	TwoFingerSync = require("famous/inputs/TwoFingerSync"), Easing = require("famous/transitions/Easing"), 
	MultipleTransition = require("famous/transitions/MultipleTransition"), SnapTransition = require("famous/transitions/SnapTransition"), 
	SpringTransition = require("famous/transitions/SpringTransition"), SnapTransition = require("famous/transitions/SnapTransition"), 
	Transitionable = require("famous/transitions/Transitionable"), TweenTransition = require("famous/transitions/TweenTransition"), 
	WallTransition = require("famous/transitions/WallTransition"), KeyCodes = require("famous/utilities/KeyCodes"), 
	Utility = require("famous/utilities/Utility"), ContextualView = require("famous/views/ContextualView"), 
	Deck = require("famous/views/Deck"), EdgeSwapper = require("famous/views/EdgeSwapper"), 
	FlexibleLayout = require("famous/views/FlexibleLayout"), Flipper = require("famous/views/Flipper"), 
	GridLayout = require("famous/views/GridLayout"), HeaderFooterLayout = require("famous/views/HeaderFooterLayout"), 
	Lightbox = require("famous/views/Lightbox"), RenderController = require("famous/views/RenderController"), 
	ScrollContainer = require("famous/views/ScrollContainer"), Scrollview = require("famous/views/Scrollview"), 
	SequentialLayout = require("famous/views/SequentialLayout"), NavigationBar = require("famous/widgets/NavigationBar"), 
	Slider = require("famous/widgets/Slider"), TabBar = require("famous/widgets/TabBar"), 
	ToggleButton = require("famous/widgets/ToggleButton"), DeviceView = require("widgets/DeviceView"), 
	IframeSurface = require("widgets/IframeSurface"), RenderHelpers = require("helpers/RenderHelpers"), RealEngine = require("famous/core/Engine"), RealTimer = require("famous/utilities/Timer"), LISTENERS = [], Engine = {};

	mainContext = RealEngine.createContext();
});
