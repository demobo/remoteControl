/*
 * @author Sebastian Miller-Hack
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define(function(require, exports, module) {

    //TEMPORARY PLACEHOLDER CODE
    var RangeAndroid = require('controls-android/RangeAndroid');

    function RangeIos() {
        RangeAndroid.apply(this, arguments);
    }
    /*
    RangeIos.DEFAULT_OPTIONS {
        dot: {
            size: [56, 56],
            classes: ['ios', 'range-dot']
        },
        bar: {
            size: [570, 4],
            classes: ['ios', 'range-bar']
        },
        background: {
            size: [570, 4],
            classes: ['ios', 'range-background']
        }
    };
    */
    module.exports = RangeIos;

});
