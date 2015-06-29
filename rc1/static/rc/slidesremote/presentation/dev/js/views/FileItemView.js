define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');

    function FileItemView() {
        View.apply(this, arguments);
        _createViews.call(this);
        _setListeners.call(this);
    }

    FileItemView.prototype = Object.create(View.prototype);
    FileItemView.prototype.constructor = FileItemView;

    FileItemView.DEFAULT_OPTIONS = {};

    function _createViews() {

    }

    function _setListeners() {

    }

    module.exports = FileItemView;
});