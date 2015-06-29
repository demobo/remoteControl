define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');

    function PopupView() {
        View.apply(this, arguments);
        _createViews.call(this);
        _setListeners.call(this);
    }

    PopupView.prototype = Object.create(View.prototype);
    PopupView.prototype.constructor = PopupView;

    PopupView.DEFAULT_OPTIONS = {};

    function _createViews() {

    }

    function _setListeners() {

    }

    module.exports = PopupView;
});