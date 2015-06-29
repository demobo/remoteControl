define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require('famous/views/Scrollview');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var Utility = require('famous/utilities/Utility');

    var Login = require('widgets/Login');

    function LoginView() {
        View.apply(this, arguments);
        _createViews.call(this);
        _setListeners.call(this);
        _debug.call(this);
    }
    function _debug(){
        window.loginView = this;
    }



    LoginView.prototype = Object.create(View.prototype);
    LoginView.prototype.constructor = LoginView;

    LoginView.DEFAULT_OPTIONS = {
        backgroundSize:[undefined, window.innerHeight* 0.4],
        loginSize:[140, window.innerHeight* 0.03]
    };

    function _createViews() {
        this.background = new Surface({
            size: this.options.backgroundSize,
            properties:{
                zIndex: -2,
                background: '-webkit-linear-gradient(top, #000, #ddd)'
            }
        });
        this.backgroundMod = new StateModifier({
            origin: [.5,.5],
            align: [.5,1],
//            transform: Transform.translate(0, 0, -1);
        });
        this.add(this.backgroundMod).add(this.background);
        this.loginMod = new StateModifier({
            origin: [.5,.5],
            align: [.5,.9],
//            transform: Transform.translate(0, 0, -1);
        });
        this.splashMod = new StateModifier({
            origin: [0.5,0],
            align: [0.5,0],
            opacity: 0
//            transform: Transform.translate(0, 0, -1);
        })

        this.splashSurface = new Surface({
            content: "<iframe src='./splashScreen.html' id='splashIframe'></iframe>",
            properties:{
                zIndex: -2,
                width: window.innerWidth,
                height: window.innerHeight*0.5
            }
        })
        this.login = new Surface({
            content: '<div id="loginButton"><i class="fa fa-google-plus loginLogo"></i><span id="loginText">Get Started</span></div>',
            size: this.options.loginSize,
            properties:{
                zIndex: -1
            }
//            properties: {
//                zIndex: 10,
//                textAlign:'center',
//                backgroundColor: '#CECDC7',
//                color: '#413E3F',
//                borderRadius: '10px',
//                cursor: 'pointer',
//                fontSize: '30px',
//                lineHeight: '50px',
//                border: '#817F80 solid 3px'
//            }
        });
        this.add(this.loginMod).add(this.login);
        this.add(this.splashMod).add(this.splashSurface);
//        setTimeout(function(){
//            $("#os-phrases > h2").lettering('words').children("span").lettering().children("span").lettering();
//        }, 1000);
    }
    function _setListeners(){
        this.login.pipe(this._eventOutput);
        setTimeout(function(){
            document.getElementById('splashIframe').onload = function(){
                this.splashMod.setOpacity(1);
            }.bind(this)
        }.bind(this), 0)
    }

    module.exports = LoginView;
});


