'use strict';

/* Services */

angular.module('boboService', [], function($provide) {
  $provide.factory('phoneService', ['$window', function(win) {
    var msgs = [];
      
    return function(f) {
      
      //win.addEventListener('message', onParentMessage, false);
      
      f();
       
      /*
      msgs.push(msg);
      win.alert(msgs.join("\n"));
      msgs = [];
      */
    };
  }]);
});