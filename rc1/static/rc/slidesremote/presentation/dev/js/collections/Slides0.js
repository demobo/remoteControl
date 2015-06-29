define(function(require, exports, module) {
    var Slide0 = require('models/Slide0');
    var Helper = require('configs/Helper');
    var setting = require('configs/Setting');

    var Slides0 = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage('slides0'),
        model: Slide0
    });

    module.exports = Slides0;
});