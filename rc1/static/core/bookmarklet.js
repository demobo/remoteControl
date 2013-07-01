/*only a reference to the bookmarklet code. */
(function(global){
  var a=global.demoboPortal, c=window.__dmtg;
  ((!a || function(){
    var d = new Date();
    var s=global.createElement('script');
    var e='//d1n57ahxxbrb1p.cloudfront.net'
    window.demoboBase=e;
    s.src=e+'/entry.js?'+d.getFullYear()+d.getMonth()+d.getDate();
    s.className='demoboJS';
    document.body && document.body.appendChild(s);
  }) 
  && c)();
})(window);
