/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @author Sebastian Miller-Hack
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
 define(function(require, exports, module) {
    var SkinData = {
        ios: {
            checkbox: {
                dot: {
                    size: [10,10],
                    classes: ['ios','checkbox-dot']
                },
                background: {
                    size: [10,10],
                    classes: ['ios','checkbox-background']
                },
                animation: {
                    duration: 10,
                    curve: 'Easing.outCubic'
                }
            },
            toggle: {
                slider: {
                    size: [56,56],
                    classes: ['ios','toggle-slider']
                },
                bgOn: {
                    size: [103,62],
                    classes: ['ios','toggle-bg-on']
                },
                bgOff: {
                    size: [103,62],
                    classes: ['ios','toggle-bg-off']
                },
                animation: {
                    duration: 500,
                    curve: 'Easing.inOutQuint'
                }
            }    
        },
        android: {
            checkbox: {
                dot: {
                    size: [40,40],
                    classes: ['android','checkbox-dot']
                },
                background: {
                    size: [40,40],
                    classes: ['android','CheckBox-background']
                }
            }
        }
    };


    module.exports = SkinData;
});
