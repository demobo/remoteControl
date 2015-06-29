define(function(require, exports, module) {
    var Slide = require('models/Slide');
    var Helper = require('configs/Helper');
    var setting = require('configs/Setting');

    var Slides = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage('slides'),
        model: Slide
    });

    module.exports = Slides;
});