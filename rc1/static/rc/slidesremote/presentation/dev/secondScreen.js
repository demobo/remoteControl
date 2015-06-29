define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var SecondScreen = require('views/SecondScreen');

    var mainContext = Engine.createContext();
    // create a new instance of app view

    var secondScreen = new SecondScreen();
    // add the instance to the context
    mainContext.add(secondScreen);
    mainContext.setPerspective(1000);


});