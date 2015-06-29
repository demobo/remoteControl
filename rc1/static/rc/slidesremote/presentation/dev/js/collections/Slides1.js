define(function(require, exports, module) {
    var Slide1 = require('models/Slide1');
    var Helper = require('configs/Helper');
    var setting = require('configs/Setting');

    var Slides1 = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage('slides1'),
        model: Slide1
    });

    module.exports = Slides1;
});