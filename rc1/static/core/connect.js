(function(){
var dev = true;
var base;
if (dev)
  base = 'http://10.0.0.16:1240/';
else
  base = 'something else';

var html= '<div class="modal-body"> <div id="intro"> <div class="instructions"> <div class="steps"> <div class="step" id="step1"> <div class="step-to-computer"> <div class="number"> 1 </div> <div class="text"> Get <strong>deMobo</strong> for <br> <a href="http://itunes.apple.com/us/app/de-mobo/id519605488?ls=1&mt=8" target="_blank">iPhone</a> and use WIFI. </div> <a href="http://itunes.apple.com/us/app/de-mobo/id519605488?ls=1&mt=8"> <img src="http://www.demobo.com/img/parallax-slider/demobo.png" class="instructions-1"> </a> </div> </div> <div class="step" id="step2"> <div class="step-to-computer"> <div class="number"> 2 </div> <div class="text"> Press and hold <strong>"Enter"</strong> key <br> to accept connections. </div> <img src="'+base+'core/enterhold.png" class="instructions-2"> </div> </div> <div class="step" id="step3"> <div> <div class="number"> 3 </div> <div class="text"> Start <strong>deMobo</strong> and <strong>shake</strong> your phone to connect. </div> <img src="'+base+'core/shake.png" class="instructions-3"> </div> </div> </div> </div> </div> </div> <div class="modal-footer"> <button id="dontShow">OK, I got it.</button> <button id="closeTutorial">Close</button> </div>';

var css = '@font-face{font-family:"Economica";font-style:normal;font-weight:700;src:local("Economica Bold"),local("Economica-Bold"),url(http://themes.googleusercontent.com/static/fonts/economica/v1/UK4l2VEpwjv3gdcwbwXE9KRDOzjiPcYnFooOUGCOsRk.woff) format("woff")}#demoboConnect{font-family:"Economica",ProximaNova-Semibold,HelveticaNeue,"Helvetica Neue",Helvetica,Arial,sans-serif;height:388px;-moz-transition-delay:initial,initial;-moz-transition-duration:.3s,.3s;-moz-transition-property:opacity,top;-moz-transition-timing-function:linear,ease-out;-webkit-background-clip:padding-box;-webkit-box-shadow:rgba(0,0,0,0.298039) 0 3px 7px;-webkit-transition-delay:initial,initial;-webkit-transition-duration:.3s,.3s;-webkit-transition-property:opacity,top;-webkit-transition-timing-function:linear,ease-out;background-clip:padding-box;background-color:#fff;border-color:rgba(0,0,0,0.298039);border-radius:6px;border-width:1px;border-style:solid;box-shadow:rgba(0,0,0,0.298039) 0 3px 7px;color:black;display:block;left:33%;margin:0 0 0 -280px;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";filter:alpha(opacity=0);opacity:0;padding:0;position:fixed;top:-400px;transition-delay:initial,initial;transition-duration:.3s,.3s;transition-property:opacity,top;transition-timing-function:linear,ease-out;width:1000px;z-index:999999}#demoboConnect .modal-body{height:300px;margin:0;max-height:400px;overflow:hidden;padding:15px;position:relative;width:970px}#demoboConnect .modal-footer{-moz-border-radius:0 0 6px 6px;-moz-box-shadow:inset 0 1px 0 #fff;-webkit-border-radius:0 0 6px 6px;-webkit-box-shadow:inset 0 1px 0 #fff;background-color:#f5f5f5;border-radius:0 0 6px 6px;border-top:1px solid #ddd;box-shadow:inset 0 1px 0 #fff;height:28px;padding:14px 15px 15px;text-align:right;width:970px}#demoboConnect #intro,#demoboConnect .instructions,#demoboConnect .steps,#demoboConnect .step{height:300px}#demoboConnect #intro .number{color:rgba(0,0,0,0.5);float:left;font-size:70px;margin-top:-14px;padding-top:20px}#demoboConnect .steps{display:block;padding-left:40px}#demoboConnect .step{display:table-cell;padding-top:22px;width:310px}#demoboConnect .step img{-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";filter:alpha(opacity=50);opacity:.5}#demoboConnect #step1 img{padding-left:22px;padding-top:37px;width:113px}#demoboConnect #step2 img,#demoboConnect #step3 img{width:200px}#demoboConnect .text{font-size:24px;font-weight:2000;padding-left:50px;padding-top:20px}#demoboConnect #intro .step a{color:orange;font-weight:bold;text-decoration:none}#intro img{border:none}#demoboConnect button{-moz-box-shadow:none;-moz-transition-delay:initial;-moz-transition-duration:.25s;-moz-transition-property:initial;-moz-transition-timing-function:initial;-webkit-appearance:button;-webkit-backface-visibility:hidden;-webkit-box-shadow:none;-webkit-transition-delay:initial;-webkit-transition-duration:.25s;-webkit-transition-property:initial;-webkit-transition-timing-function:initial;border-left-color:initial;border-left-width:initial;border-radius:4px;border-right-color:initial;border-right-width:initial;border-style:none;border-top-color:initial;border-top-width:initial;box-shadow:none;color:white;cursor:pointer;display:inline-block;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:16.5px;font-weight:normal;line-height:20px;margin:0;padding:4px 12px;text-align:center;text-decoration:none;text-shadow:none;transition-delay:initial;transition-duration:.25s;transition-property:initial;transition-timing-function:initial;vertical-align:middle}#dontShow{background-color:#1abc9c;margin-right:10px}#closeTutorial{background-color:#34495e}#dontShow:hover,#closeTutorial:hover{background-color:#e6e6e6;color:#333}#dontShow:active,#closeTutorial:active{-moz-box-shadow:inset 0 3px 8px #a0a0a0;-webkit-box-shadow:inset 0 3px 8px #a0a0a0;box-shadow:inset 0 3px 8px #a0a0a0}';

var demoboConnect = document.createElement('div');
demoboConnect.id = 'demoboConnect';
var demoboCss = document.createElement('style');
demoboCss.classList.add('demoboCss');
demoboCss.innerHTML = css;
demoboConnect.innerHTML = html;
document.body.appendChild(demoboConnect);
document.body.appendChild(demoboCss);

window._showDemoboConnect = function(){
  var c = document.getElementById('demoboConnect');
  c.style['-ms-filter'] = "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
  c.style.filter = 'alpha(opacity=100)';
  c.style.opacity = 1;
  c.style.top = '10%';
};

window._hideDemoboConnect = function(){
  var c = document.getElementById('demoboConnect');
  c.style['-ms-filter'] = "";
  c.style.filter = '';
  c.style.opacity = '';
  c.style.top = '';
};

var e = document.querySelector('#demoboConnect #dontShow');

if (window.localStorage && window.localStorage.getItem('demoboNotShow')==="1"){ 
  e.parentNode.removeChild(e);
}else{
  e.onclick = function(){
    window.localStorage.setItem('demoboNotShow', 1);
    window._hideDemoboConnect();
    e.parentNode.removeChild(e);
  };
  setTimeout(window._showDemoboConnect, 500);
}

document.querySelector('#demoboConnect #closeTutorial').onclick = window._hideDemoboConnect;

})();
