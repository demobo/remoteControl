/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: Brian Chu
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define(function(require, exports, module) {
    module.exports.ios = {
        Button: {
            base: {
                size: [100, 40],
                classes: ['fa-btn', 'ios']
            },
            'delete': {
                size: [178, 113],
                lineHeight: 113,
                classes: ['fa-btn', 'ios', 'delete'],
                content: 'Delete'
            }
        }
    };

    module.exports.android = {

    };

    module.exports.windows = {

    };

    module.exports.famous = {

    };
});
