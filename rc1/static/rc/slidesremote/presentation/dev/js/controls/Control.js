/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: Brian Chu
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var OptionsManager = require('famous/core/OptionsManager');
    var View = require('famous/core/View');
    var Skins = require('skins/Skins');

    function Control() {
        View.apply(this, arguments);
        var options = Object.create(Control.DEFAULT_OPTIONS);
        this.options = OptionsManager.patch(options, this.options);

        var skin = this.options.skin;
        if (skin && skin !== 'base') {
            var controlName = this.constructor.name;
            var type = this.options.type;
            // ex: Skins.ios.Button.base
            var skinOptions = Skins[skin][controlName][type];
            OptionsManager.patch(this.options, skinOptions);
        }
    }

    Control.prototype = Object.create(View.prototype);
    Control.prototype.constructor = Control;
    Control.DEFAULT_OPTIONS = {
        type: 'base',
        skin: 'base'
    };

    module.exports = Control;
});
